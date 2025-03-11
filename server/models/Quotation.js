// models/Quotation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Quotation = sequelize.define(
  "Quotation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    quotationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    revisionNumber: {
      type: DataTypes.STRING,
      defaultValue: "00",
    },
    validity: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    termsChargeDays: {
      type: DataTypes.INTEGER,
    },
    termsCharge: {
      type: DataTypes.STRING,
    },
    termsBuyingDays: {
      type: DataTypes.INTEGER,
    },
    termsBuying: {
      type: DataTypes.STRING,
    },
    isPDC: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    termsPDCDays: {
      type: DataTypes.INTEGER,
    },
    scopeOfWork: {
      type: DataTypes.STRING,
    },
    contactPerson: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive"],
      defaultValue: "active",
    },
    isOneTime: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

module.exports = Quotation;
