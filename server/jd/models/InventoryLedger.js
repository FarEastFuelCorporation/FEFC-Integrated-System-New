// models/InventoryLedger.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InventoryLedgerJD = sequelize.define(
  "InventoryLedgerJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    inventoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    transaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = InventoryLedgerJD;
