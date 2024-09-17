const Router = require("express");
const express = require("express");
const sequelizeCrud =
    require("express-crud-router-sequelize-v6-connector").default;
const crud = require("express-crud-router").default;
const User = require("../models/models").User;
const router = new Router();

const {
    Planet,
    Element,
    Wallet,
    UserPlanets,
    History,
} = require("../models/models");
const userController = require("../controllers/userController");

const app = new express();

app.use(
    crud("/users", sequelizeCrud(User), {
        additionalAttributes: {
            wallet: (user) => Wallet.findOne({ where: { userId: user.id } }),
            userPlanets: (user) =>
                UserPlanets.findAll({ where: { userId: user.id } }),
            history: (user) => History.findOne({ where: { userId: user.id } }),
        },
    })
);
app.use(
    crud(
        "/planets",
        {
            ...sequelizeCrud(Planet),
            get: async ({ filter, limit, offset, order }, { req, res }) =>
                res.json(
                    await Planet.findAndCountAll({
                        limit,
                        offset,
                        include: [{model: Element}, {model: UserPlanets, required: false}],
                        order: [[UserPlanets, 'userId', 'DESC'], ['forLaboratory', 'DESC'], ['id', 'ASC']],
                        where: filter,
                        subQuery: false

                    })
                ),
        },
        {
            additionalAttributes: {
                element: (planet) =>
                    Planet.findOne({
                        where: { id: planet.id },
                        include: Element,
                    }).then((data) => data.elements[0]),
                userHasPlanet: async (planet, { req }) => {
                    if (req.query.custom) {
                        const customPlanet = await UserPlanets.findOne({
                            where: {
                                userId: req.query.custom,
                                planetId: planet.id,
                            },
                        });
                        if (customPlanet?.dataValues?.level) {
                            return 1;
                        }
                    }
                    return 0;
                },
            },
        }
    )
);
app.post("/user/auth", userController.login);
app.use(crud("/elements", sequelizeCrud(Element)));
//router.get('/users', UserController.getAll)
app.use(
    crud("/wallet", sequelizeCrud(Wallet), {
        // additionalAttributes: {
        //     element: (wallet) => Element.findOne({where: {id: wallet.elementId}})
        // }
    })
);
app.use(crud("/userPlanets", sequelizeCrud(UserPlanets)));
app.use(crud("/userHistory", sequelizeCrud(History)));
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

module.exports = app;
