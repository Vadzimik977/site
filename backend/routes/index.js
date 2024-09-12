const Router = require("express");
const express = require("express");
const sequelizeCrud =
    require("express-crud-router-sequelize-v6-connector").default;
const crud = require("express-crud-router").default;
const User = require("../models/models").User;
const router = new Router();

const { Planet, Element, Wallet } = require("../models/models");
const userController = require("../controllers/userController");

const app = new express();

app.use(crud("/users", sequelizeCrud(User), {
    additionalAttributes: {
        wallet: (user) => Wallet.findOne({where: {userId: user.id}})
    }
}));
app.use(
    crud("/planets", sequelizeCrud(Planet), {
        additionalAttributes: {
            element: (planet) =>
                Planet.findOne({
                    where: { id: planet.id },
                    include: Element,
                }).then((data) => data.elements[0]),
        },
    })
);
app.post('/user/auth', userController.login);
app.use(crud("/elements", sequelizeCrud(Element)));
//router.get('/users', UserController.getAll)
app.use(crud("/wallet", sequelizeCrud(Wallet), {
    // additionalAttributes: {
    //     element: (wallet) => Element.findOne({where: {id: wallet.elementId}})
    // }
}));
//app.use(crud("/wallet", sequelizeCrud(Wallet)));

module.exports = app;
