// models/employee.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmployeeJD = sequelize.define(
  "EmployeeJD",
  {
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    affix: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    designation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    birthPlace: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    mobileNo: {
      type: DataTypes.TEXT,
    },
    emailAddress: {
      type: DataTypes.TEXT,
    },
    profile_picture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    submittedBy: {
      type: DataTypes.TEXT,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = EmployeeJD;
