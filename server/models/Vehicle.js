// models/Vehicle.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    vehicleTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vehicleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    netCapacity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ownership: {
      type: DataTypes.ENUM("OWNED", "LEASED"),
      allowNull: false,
    },
    makeModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearManufacture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationExpirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    insuranceProvider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceExpirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    engineType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grossVehicleWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    curbWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
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

module.exports = Vehicle;
