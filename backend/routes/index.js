const Router = require('express');
const express = require('express');
const sequelizeCrud = require('express-crud-router-sequelize-v6-connector').default;
const crud = require('express-crud-router').default;
const User = require('../models/models').User;
const router = new Router();
const seq = require('sequelize');

const { Planet, Element, Wallet, UserPlanets, History, Alliance, Tasks, Cosmoports } = require('../models/models');
const userController = require('../controllers/userController');

const app = new express();

app.use(
    crud('/users', sequelizeCrud(User), {
        additionalAttributes: {
            wallet: (user) => Wallet.findOne({ where: { userId: user.id } }),
            userPlanets: (user) => UserPlanets.findAll({ where: { userId: user.id } }),
            history: (user) => History.findOne({ where: { userId: user.id } }),
        },
    }),
);

app.use(
    crud('/planets_admin', sequelizeCrud(Planet), {
        additionalAttributes: {
            element: async (planet) =>
                await Planet.findOne({
                    where: { id: planet.id },
                    include: Element,
                }).then((data) => data.elements[0]),
        },
    }),
);

app.use(
    crud(
        '/planets',
        {
            ...sequelizeCrud(Planet),
            get: async ({ filter, limit, offset, order }, { req, res }) =>
                res.json(
                    await Planet.findAndCountAll({
                        limit,
                        offset,
                        include: [{ model: Element }, { model: UserPlanets, required: false }],
                        order: [
                            //['user_planets', 'userId', 'LIKE 7'],
                            //[seq.fn('ISNULL', seq.col('user_planets.id'), 'LIKE 7')],
                            [seq.literal(`case when user_planets.userId LIKE ${req?.query?.userId ?? '0'} then 1 else 2 end`)],
                            ['forLaboratory', 'DESC'],
                        ],
                        where: filter,
                        subQuery: false,
                    }),
                ),
        },
        // {
        //     additionalAttributes: {
        //         element: (planet) =>
        //             Planet.findOne({
        //                 where: { id: planet.id },
        //                 include: Element,
        //             }).then((data) => data.elements[0]),
        //         userHasPlanet: async (planet, { req }) => {
        //             if (req.query.userId) {
        //                 const customPlanet = await UserPlanets.findOne({
        //                     where: {
        //                         userId: req.query.custom,
        //                         planetId: planet.id,
        //                     },
        //                 });
        //                 if (customPlanet?.dataValues?.level) {
        //                     return 1;
        //                 }
        //             }
        //             return 0;
        //         },
        //     },
        // }
    ),
);
app.post('/user/auth', userController.login);
app.use(crud('/elements', sequelizeCrud(Element)));
//router.get('/users', UserController.getAll)
app.use(
    crud('/wallet', sequelizeCrud(Wallet), {
        // additionalAttributes: {
        //     element: (wallet) => Element.findOne({where: {id: wallet.elementId}})
        // }
    }),
);
app.use(
    crud('/userPlanets', {
        ...sequelizeCrud(UserPlanets),
        get: async ({}, { req, res }) => {
            const planetId = req?.params?.id;
            if (planetId) {
                const result = await UserPlanets.findAll({
                    where: {
                        planetId,
                        level: {
                            [seq.Op.ne]: 0,
                        },
                    },
                });
                return res.json({ result: result });
            }

            return res.json({ result });
        },
    }),
);
//

app.use(crud('/userHistory', sequelizeCrud(History)));
// app.post('/hasPlanet', async (req, res) => {
//     const { userId, planetId } = req.body;
//     try {
//         await UserPlanets.create({ userId, planetId });
//         return res.status(200)
//     } catch(err) {
//         return res.status(404)
//     }
//     return res.status(200);
// })
//app.use(crud("/wallet", sequelizeCrud(Wallet)));

app.use(
    crud('/alliance', {
        get: async ({}, { req, res }) => {
            const token = req.headers.authorization;
            const user = await User.findOne({ where: { adress: token } });

            if (!user) {
                return res.status(403).json({ result: [] });
            }
            const result = await Alliance.findAndCountAll({
                where: { userId: user.id },
            });
            return res.json({ result: result.rows });
        },
        create: async ({}, { req, res }) => {
            const { planetId } = req.body;
            try {
                const token = req.headers.authorization;
                const user = await User.findOne({ where: { adress: token } });
                const userId = user.id;

                if (!user) {
                    return res.status(403).json({ result: [] });
                }

                const check = await Alliance.findOne({ where: { userId, planetId } });
                if (check) {
                    return res.status(403).json({ result: [] });
                }

                await Alliance.create({
                    userId,
                    planetId,
                });

                const result = await Alliance.findAndCountAll({
                    where: { userId: user.id },
                });
                return res.json({ result: result.rows });
            } catch (err) {
                console.log(err);

                return res.status(404);
            }
        },
    }),
);

///
app.get('/user', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ user: null });
    }

    User.findOne({ where: { adress: token } })
        .then(async (user) => {
            if (!user) {
                return res.status(401).send({ user: null });
            }
            const userV = user.dataValues;

            console.log(userV);
            console.log(userV.id);

            const wallet = await Wallet.findOne({ where: { userId: userV.id } });
            const history = await History.findOne({ where: { userId: userV.id } });
            const usersPlanet = await UserPlanets.findAll({ where: { userId: userV.id } });

            return res.status(200).json({ user: { ...userV, wallet, history, usersPlanet } });
        })
        .catch((err) => {
            console.log(err);

            return res.status(404).send({ user: null });
        });
});
// create user
app.post('/user', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send('No token provided');
    }

    const isUserCreated = await User.findOne({ where: { adress: token } });

    if (isUserCreated) {
        return res.status(409).send('User already created');
    } else {
        const newUser = await User.create();
        const wallet = await Wallet.create({
            userId: newUser.dataValues.id,
        });
        const history = await History.create({
            userId: newUser.dataValues.id,
        });

        return res.json({ user: { ...newUser.dataValues, wallet, history } });
    }
});

app.use(crud('/tasks', sequelizeCrud(Tasks)));
app.use(crud('/cosmoports', sequelizeCrud(Cosmoports)));
module.exports = app;
