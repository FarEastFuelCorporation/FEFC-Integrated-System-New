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
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.ENUM,
      values: ["ACTIVE", "INACTIVE"],
      defaultValue: "ACTIVE",
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    affix: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    civilStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    bloodType: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    ethnicOrigin: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    citizenship: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    religion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    municipality: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    barangay: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    otherProvince: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    otherMunicipality: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    otherBarangay: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    otherAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    mobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    landlineNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    emailAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    payrollType: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    salaryType: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    designation: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    immediateHeadId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tinId: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    philhealthId: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    sssId: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    pagibigId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    fathersReligion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    fathersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    fathersMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    mothersName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    mothersReligion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    mothersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    mothersMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    spouseName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    spouseReligion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    spouseAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    spouseMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    educationalAttainment: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    schoolName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    course: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    level: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    year: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    referenceName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    referenceAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    referenceMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    emergencyName: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    emergencyAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    emergencyMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  }
);

module.exports = EmployeeRecord;
