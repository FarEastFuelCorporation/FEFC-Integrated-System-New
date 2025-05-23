// models/BilledTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const BilledTransaction = sequelize.define(
  "BilledTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    bookedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    billingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    billedTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    serviceInvoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billedAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    isWasteName: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPerClient: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isIndividualBilling: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isIndividualWaste: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isChargeOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    remarks: {
      type: DataTypes.STRING,
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

module.exports = BilledTransaction;
