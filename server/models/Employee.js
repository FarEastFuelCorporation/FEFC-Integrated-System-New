// models/employee.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path accordingly

const Employee = sequelize.define(
  "Employee",
  {
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    affix: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    birthPlace: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    mobileNo: {
      type: DataTypes.STRING(50),
    },
    emailAddress: {
      type: DataTypes.STRING(50),
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    permanentAddress: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    otherAddress: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    motherMaidenName: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    educationalAttainment: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    course: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    yearGraduate: {
      type: DataTypes.STRING(50),
    },
    tinNo: {
      type: DataTypes.STRING(50),
    },
    sssGsisNo: {
      type: DataTypes.STRING(50),
    },
    philhealthNo: {
      type: DataTypes.STRING(50),
    },
    pagIbigNo: {
      type: DataTypes.STRING(50),
    },
    driversLicenseNo: {
      type: DataTypes.STRING(50),
    },
    nbiNo: {
      type: DataTypes.STRING(50),
    },
    policeClearanceNo: {
      type: DataTypes.STRING(50),
    },
    cedulaNo: {
      type: DataTypes.STRING(50),
    },
    dateHire: {
      type: DataTypes.DATEONLY,
    },
    employeeType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dailyRate: {
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
    timeIn: {
      type: DataTypes.STRING(50),
    },
    timeOut: {
      type: DataTypes.STRING(50),
    },
    dateOfResignation: {
      type: DataTypes.DATEONLY,
    },
    reasonOfResignation: {
      type: DataTypes.STRING(50), // Changed to STRING(50)
    },
    picture: {
      type: DataTypes.STRING(50),
      allowNull: true, // Adjust based on your requirements
    },
    submittedBy: {
      type: DataTypes.STRING(50),
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Employee;
