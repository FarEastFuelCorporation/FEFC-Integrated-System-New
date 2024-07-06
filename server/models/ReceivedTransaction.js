// models/ReceivedTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const ReceivedTransaction = sequelize.define(
  "ReceivedTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    scheduledTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    helperId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDispatched: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dispatchedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dispatchedTime: {
      type: DataTypes.TIME,
      allowNull: true,
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

module.exports = ReceivedTransaction;
