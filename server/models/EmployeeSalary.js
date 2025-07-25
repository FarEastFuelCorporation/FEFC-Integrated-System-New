// models/Leave.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const EmployeeSalary = sequelize.define("EmployeeSalary", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // Generate UUID automatically
    allowNull: false,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  payrollType: {
    type: DataTypes.ENUM,
    values: ["SEMI-MONTHLY", "WEEKLY"],
    allowNull: false,
  },
  salaryType: {
    type: DataTypes.ENUM,
    values: ["CASH", "ATM"],
    allowNull: false,
  },
  compensationType: {
    type: DataTypes.ENUM,
    values: ["FIXED", "TIME BASED"],
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dayAllowance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
});

module.exports = EmployeeSalary;
