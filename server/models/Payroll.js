// models/Payroll.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");

const Payroll = sequelize.define("Payroll", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), // Generate UUID automatically
    allowNull: false,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  payrollType: {
    type: DataTypes.ENUM,
    values: ["SEMI-MONTHLY", "WEEKLY"],
    allowNull: false,
  },
  salaryType: {
    type: DataTypes.ENUM,
    values: ["CASH", "ATM"],
    allowNull: false,
  },
  compensationType: {
    type: DataTypes.ENUM,
    values: ["FIXED", "TIME BASED"],
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dayAllowance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  nightAllowance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weekNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  paidBreak: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  scheduledIn: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  scheduledOut: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  day1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day1In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day1Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  createdBy: {
  day2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day2In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day2Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day3In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day3Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day4In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day4Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
    day5: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day5In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day5Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day6: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day6In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day6Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day7: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day7In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day7Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day8: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day8In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day8Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day9: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day9In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day9Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day10: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day10In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day10Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day11: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day11In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day11Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day12: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day12In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day12Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day13: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day13In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day13Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day14: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day14In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day14Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day15: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day15In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day15Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day16: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day16In: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  day16Out: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
});

module.exports = Payroll;
