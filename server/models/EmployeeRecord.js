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
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.ENUM,
      values: ["ACTIVE", "INACTIVE"],
      defaultValue: "ACTIVE",
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    affix: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bloodType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ethnicOrigin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    religion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    municipality: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    otherProvince: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otherMunicipality: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otherBarangay: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otherAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    landlineNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    employeeType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    immediateHeadId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tinId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    philhealthId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sssId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pagibigId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fathersName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fathersReligion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fathersAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fathersMobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mothersName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mothersReligion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mothersAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mothersMobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    spouseReligion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    spouseAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    spouseMobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    educationalAttainment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    schoolName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referenceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referenceAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referenceMobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergencyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergencyAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergencyMobileNumber: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  }
);

module.exports = EmployeeRecord;
