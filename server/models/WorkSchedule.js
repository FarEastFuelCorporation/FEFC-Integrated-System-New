// models/Leave.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const WorkSchedule = sequelize.define("WorkSchedule", {
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
  mondayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  mondayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  tuesdayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  tuesdayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  wednesdayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  wednesdayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  thursdayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  thursdayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fridayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fridayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  saturdayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  saturdayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  sundayIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  sundayOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = WorkSchedule;
