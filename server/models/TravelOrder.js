// models/Attendance.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const TravelOrder = sequelize.define("TravelOrder", {
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
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  arrivalTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  out: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  in: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = TravelOrder;
