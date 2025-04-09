// models/Ledger.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LedgerJD = sequelize.define(
  "LedgerJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
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
    transactionDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fundSource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fundAllocation: {
      type: DataTypes.STRING,
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

module.exports = LedgerJD;
