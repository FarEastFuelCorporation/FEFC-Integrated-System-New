// models/ProductLedger.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductLedgerJD = sequelize.define(
  "ProductLedgerJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    productId: {
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
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount: {
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

module.exports = ProductLedgerJD;
