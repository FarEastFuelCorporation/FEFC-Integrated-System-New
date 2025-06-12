// models/EmployeeContract.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const EmployeeContract = sequelize.define("EmployeeContract", {
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
  contractStatus: {
    type: DataTypes.ENUM,
    values: ["ACTIVE", "INACTIVE"],
    defaultValue: "ACTIVE",
  },
  contractType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contractStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  contractEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  employeeType: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  designation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  immediateHeadId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachment: {
    type: DataTypes.BLOB("long"),
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
});

module.exports = EmployeeContract;
