const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const EmployeeRecord = sequelize.define(
  "EmployeeRecord",
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.ENUM,
      values: ["ACTIVE", "INACTIVE"],
      defaultValue: "ACTIVE",
    },
    firstName: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: true,
    },
    affix: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["Male", "Female", "Other"],
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.ENUM,
      values: ["Single", "Married", "Widowed", "Divorced"],
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: true,
    },
    bloodType: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    citizenship: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    religion: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    municipality: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT, // Changed to TEXT
      allowNull: false,
    },
    otherProvince: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    otherMunicipality: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    otherBarangay: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    otherAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    landlineNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emailAddress: {
      type: DataTypes.STRING(100), // Increased size
      allowNull: true,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.STRING(20), // Increased size
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING(20), // Increased size
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING(20), // Increased size
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    immediateHeadId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tinId: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    philhealthId: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    sssId: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    pagibigId: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    fathersName: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    fathersReligion: {
      type: DataTypes.STRING(50), // Increased size
      allowNull: false,
    },
    fathersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersMobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    mothersName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mothersReligion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mothersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mothersMobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    spouseReligion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    spouseAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    spouseMobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    educationalAttainment: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    schoolName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    referenceName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    referenceAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceMobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergencyName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    emergencyAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyMobileNumber: {
      type: DataTypes.STRING(20),
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = EmployeeRecord;
