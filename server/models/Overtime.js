// models/Leave.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const Overtime = sequelize.define("Overtime", {
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
  dateStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeStart: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  dateEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeEnd: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isApproved: {
    type: DataTypes.ENUM,
    values: ["APPROVED", "DISAPPROVED"],
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
});

module.exports = Overtime;
