const Router = require('express');
const express = require('express')
const sequelizeCrud = require('express-crud-router-sequelize-v6-connector').default
const crud = require('express-crud-router').default;
const User = require('../models/models').User;
const router = new Router();
const UserController = require('../controllers/userController');
const { Planet } = require('../models/models');
console.log(User.findAll())
const app = new express();

app.use(
    crud('/users', sequelizeCrud(User))
)
app.use(
    crud('/planets', sequelizeCrud(Planet))
)
//router.get('/users', UserController.getAll)


module.exports = app;