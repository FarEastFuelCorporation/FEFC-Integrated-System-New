const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const EmployeeRoleJD = require("./EmployeeRole");
const Employee = require("./Employee");

const EmployeeRolesEmployeeJD = sequelize.define(
  "EmployeeRolesEmployeeJD",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    employeeRoleId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeRoleJD,
        key: "employeeRoleId",
      },
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      references: {
        model: Employee,
        key: "employeeId",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = EmployeeRolesEmployeeJD;
