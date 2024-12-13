// models/WarehousedTransactionItem.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const WarehousedOutTransactionItem = sequelize.define(
  "WarehousedOutTransactionItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    warehousedOutTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    warehousedTransactionItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = WarehousedOutTransactionItem;
