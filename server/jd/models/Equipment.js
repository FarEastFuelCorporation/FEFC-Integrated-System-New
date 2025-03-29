// models/Equipment.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EquipmentJD = sequelize.define(
  "EquipmentJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    transactionId: {
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
    equipmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
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

module.exports = EquipmentJD;
