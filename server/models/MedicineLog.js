// models/MedicineLog.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const MedicineLog = sequelize.define(
  "MedicineLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    medicineId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction: {
      type: DataTypes.ENUM,
      values: ["RE-STOCK", "ISSUANCE"],
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    transactionTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = MedicineLog;
