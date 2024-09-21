const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const EmployeeRecord = sequelize.define(
  "EmployeeRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.ENUM,
      values: ["ACTIVE", "INACTIVE"],
      defaultValue: "ACTIVE",
    },
    firstName: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
    affix: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10), // Adjusted length
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.STRING(10), // Adjusted length
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
    bloodType: {
      type: DataTypes.STRING(3), // Adjusted length
      allowNull: false,
    },
    ethnicOrigin: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    religion: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    municipality: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(15), // Adjusted length
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING(50), // Adjusted length
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tinId: {
      type: DataTypes.STRING(20), // Adjusted length
      allowNull: false,
    },
    philhealthId: {
      type: DataTypes.STRING(20), // Adjusted length
      allowNull: false,
    },
    sssId: {
      type: DataTypes.STRING(20), // Adjusted length
      allowNull: false,
    },
    pagibigId: {
      type: DataTypes.STRING(20), // Adjusted length
      allowNull: false,
    },
    picture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    signature: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING(100), // Adjusted length
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = EmployeeRecord;
