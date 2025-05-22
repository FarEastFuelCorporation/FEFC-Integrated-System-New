// models/Agent.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path accordingly

const Agent = sequelize.define(
  "Agent",
  {
    agentId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    affix: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    mobileNo: {
      type: DataTypes.TEXT,
    },
    emailAddress: {
      type: DataTypes.TEXT,
    },
    permanentAddress: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    submittedBy: {
      type: DataTypes.TEXT,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Agent;
