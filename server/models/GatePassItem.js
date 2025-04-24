// models/GatePassItem.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const GatePassItem = sequelize.define(
  "GatePassItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    gatePassId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = GatePassItem;
