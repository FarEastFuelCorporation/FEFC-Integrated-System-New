// config/database.js

const { Sequelize } = require("sequelize");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sequelizeJD = new Sequelize({
  dialect: process.env.DB_DIALECT2,
  host: process.env.DB_HOST2,
  username: process.env.DB_USER2,
  password: process.env.DB_PASS2,
  database: process.env.DB_NAME2,
  port: process.env.DB_PORT,
  timezone: "+08:00",
  pool: {
    max: 100, // Maximum number of connections
    min: 0, // Minimum number of connections
    acquire: 120000, // Maximum time in ms to acquire a connection
    idle: 120000, // Time in ms before releasing an idle connection
  },
});

module.exports = sequelizeJD;
