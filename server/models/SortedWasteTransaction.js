// models/SortedWasteTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const SortedWasteTransaction = sequelize.define("SortedWasteTransaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // Generate UUID automatically
    allowNull: false,
    primaryKey: true,
  },
  sortedTransactionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quotationWasteId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  treatmentProcessId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  wasteName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = SortedWasteTransaction;
