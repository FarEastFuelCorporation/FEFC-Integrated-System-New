// utils/associations.js

const EmployeeJD = require("../models/Employee");
const EmployeeRoleJD = require("../models/EmployeeRole");
const EmployeeRolesEmployeeJD = require("../models/EmployeeRolesEmployee");
const UserJD = require("../models/User");

// Define associations
EmployeeJD.hasMany(UserJD, {
  as: "UserJD",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
UserJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRoleJD.belongsToMany(EmployeeJD, {
  through: EmployeeRolesEmployeeJD,
  foreignKey: "employeeRoleId",
  otherKey: "employeeId",
  as: "EmployeesJD",
});
EmployeeJD.belongsToMany(EmployeeRoleJD, {
  through: EmployeeRolesEmployeeJD,
  foreignKey: "employeeId",
  otherKey: "employeeRoleId",
  as: "EmployeeRolesJD",
});

console.log("pass");

// Export the associations
module.exports = {
  EmployeeJD,
  EmployeeRoleJD,
  EmployeeRolesEmployeeJD,
  UserJD,
};
