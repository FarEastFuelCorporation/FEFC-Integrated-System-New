// models/Leave.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const EmployeeTimeRecord = sequelize.define(
  "EmployeeTimeRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dateIn1: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut1: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn2: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut2: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn3: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut3: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn4: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut4: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn5: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut5: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn6: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOut6: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateIn7: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateOut7: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "EmployeeTimeRecords", // ensure it matches expected table
  }
);

module.exports = EmployeeTimeRecord;
