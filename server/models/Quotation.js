// models/Quotation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");

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
      unique: true,
    },
    revisionNumber: {
      type: DataTypes.STRING,
      defaultValue: "00",
    },
    validity: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    termsCharge: {
      type: DataTypes.STRING,
    },
    termsBuying: {
      type: DataTypes.STRING,
    },
    scopeOfWork: {
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
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = Quotation;
