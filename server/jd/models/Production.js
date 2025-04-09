// models/Production.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductionJD = sequelize.define(
  "ProductionJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredientCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    packagingCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    equipmentCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    utilitiesCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    laborCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    grossIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    netIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    profitMargin: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
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

module.exports = ProductionJD;
