// models/PayrollDeduction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const PayrollDeduction = sequelize.define("PayrollDeduction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // Generate UUID automatically
    allowNull: false,
    primaryKey: true,
  },
  payrollId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  deduction: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otherDeduction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deductionAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = PayrollDeduction;
