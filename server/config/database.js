// config/database.js

const { Sequelize } = require("sequelize");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  timezone: "+08:00",
  pool: {
    max: 100, // Maximum number of connections
    min: 0, // Minimum number of connections
    acquire: 60000, // Maximum time in ms to acquire a connection
    idle: 5000, // Time in ms before releasing an idle connection
  },
  dialectOptions: {
    connectTimeout: 60000,
    requestTimeout: 60000, // Ensure request timeout is set
  },
});

module.exports = sequelize;
