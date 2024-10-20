// models/Leave.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const Leave = sequelize.define("Leave", {
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
  typeOfLeave: {
    type: DataTypes.ENUM,
    values: ["SICK LEAVE", "VACATION LEAVE", "EMERGENCY LEAVE"],
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.ENUM,
    values: ["APPROVED", "DISAPPROVED"],
    allowNull: true,
  },
  isNoted: {
    type: DataTypes.ENUM,
    values: ["APPROVED", "DISAPPROVED"],
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isHalfDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Leave;
