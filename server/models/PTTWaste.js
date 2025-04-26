// models/PTTWaste.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const PTTWaste = sequelize.define(
  "PTTWaste",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    pttId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    wasteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = PTTWaste;
