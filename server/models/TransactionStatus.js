// models/TransactionStatus.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TransactionStatus = sequelize.define("TransactionStatus", {
  id: {
    type: DataTypes.FLOAT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
});

module.exports = TransactionStatus;
