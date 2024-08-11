// models/EmployeeRecord.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const EmployeeRecord = sequelize.define(
  "EmployeeRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ethnicOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherProvince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherMunicipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherBarangay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landlineNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    immediateHeadId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tinId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    philhealthId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sssId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pagibigId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fathersName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fathersReligion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fathersAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fathersMobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mothersName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mothersReligion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mothersAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mothersMobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spouseReligion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spouseAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spouseMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    educationalAttainment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    signature: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    emergencyMobileNumber: {
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

module.exports = EmployeeRecord;
