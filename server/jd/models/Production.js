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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    yield: {
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

module.exports = ProductionJD;
