const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");

const QuotationWaste = sequelize.define(
  "QuotationWaste",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    quotationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    wasteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    wasteName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vatCalculation: {
      type: DataTypes.STRING,
    },
    hasFixedRate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fixedWeight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fixedPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return moment(rawValue).tz("Asia/Singapore").format();
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("updatedAt");
        return moment(rawValue).tz("Asia/Singapore").format();
      },
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue("deletedAt");
        return rawValue ? moment(rawValue).tz("Asia/Singapore").format() : null;
      },
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = QuotationWaste;
