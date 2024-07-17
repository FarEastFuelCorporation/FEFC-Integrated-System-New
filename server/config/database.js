// config/database.js

const { Sequelize } = require("sequelize");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT, // Change this to your database dialect (e.g., mysql, postgres, etc.)
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: "+08:00",
});

module.exports = sequelize;
