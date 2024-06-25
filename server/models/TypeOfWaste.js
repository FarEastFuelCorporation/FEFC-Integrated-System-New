// models/TypeOfWaste.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const TreatmentProcess = require("./TreatmentProcess");

const TypeOfWaste = sequelize.define(
  "TypeOfWaste",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    wasteCategory: {
      type: DataTypes.STRING,
      values: ["NHW", "HW"],
    },
    wasteCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wasteDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    treatmentProcessId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TreatmentProcess,
        key: "id",
      },
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

module.exports = TypeOfWaste;
