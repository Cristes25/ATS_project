const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.JOB_DB_NAME, process.env.JOB_DB_UNAME, process.env.JOB_DB_PASSWORD, {
  host: process.env.JOB_DB_HOST,
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
