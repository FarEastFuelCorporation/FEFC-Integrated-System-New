// models/TruckScale.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const TruckScale = sequelize.define(
  "TruckScale",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    truckScaleNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commodity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstScaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    firstScaleTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    secondScaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    secondScaleTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    grossWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tareWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    netWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = TruckScale;
