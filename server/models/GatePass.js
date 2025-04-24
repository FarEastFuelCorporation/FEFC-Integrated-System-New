// models/GatePass.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const GatePass = sequelize.define(
  "GatePass",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    gatePassNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateIn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeIn: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    dateOut: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    timeOut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    issuedTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    truckScaleNo: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = GatePass;
