// models/Attendance.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const TravelOrder = sequelize.define("TravelOrder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  synced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Make sure to include this if you're using the synced column
  },
});

module.exports = TravelOrder;
