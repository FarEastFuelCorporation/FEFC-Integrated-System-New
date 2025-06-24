// models/PayrollAdjustment.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const PayrollAdjustment = sequelize.define("PayrollAdjustment", {
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
  adjustment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adjustmentAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = PayrollAdjustment;
