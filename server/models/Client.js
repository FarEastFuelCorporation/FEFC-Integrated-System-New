const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment-timezone");

const Client = sequelize.define(
  "Client",
  {
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureOfBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [
          ["GENERATOR", "TRANSPORTER", "INTEGRATED FACILITIES MANAGEMENT"],
        ],
      },
    },
    billerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactNumber: {
      type: DataTypes.STRING,
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

module.exports = Client;
