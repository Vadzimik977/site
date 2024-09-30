require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const models = require('./models/models');
const router = require('./routes');
const port = process.env.PORT || 8000;
const cron = require('./node-cron');
const app = express();
app.use(cors());
app.use(express.json());
//app.use('/api', router);

