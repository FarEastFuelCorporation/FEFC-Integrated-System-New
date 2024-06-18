// utils/associations.js

const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const User = require("../models/User");
const TypeOfWaste = require("../models/TypeOfWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const VehicleType = require("../models/VehicleType");
const Vehicle = require("../models/Vehicle");
const Client = require("../models/Client");
const WasteCategory = require("../models/WasteCategory");
const TransactionStatus = require("../models/TransactionStatus");
const VehicleStatus = require("../models/VehicleStatus");
const VehicleLog = require("../models/VehicleLog");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const IdInformation = require("../models/IdInformation");

// Define associations
Employee.hasMany(User, {
  as: "User",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
});
User.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
});

Employee.hasOne(IdInformation, {
  foreignKey: "employee_id", // Assuming this is the foreign key in IdInformation
  sourceKey: "employeeId", // Assuming this is the source key in Employee
});

IdInformation.belongsTo(Employee, {
  foreignKey: "employee_id", // Assuming this is the foreign key in IdInformation
  targetKey: "employeeId", // Assuming this is the target key in Employee
});

// EmployeeRole.hasMany(Employee, { as: 'Employee', foreignKey: 'employeeRoleId', sourceKey: 'employeeRoleId', });
// Employee.belongsTo(EmployeeRole, { as: 'EmployeeRole', foreignKey: 'employeeRoleId', targetKey: 'employeeRoleId' });

EmployeeRole.belongsToMany(Employee, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeRoleId",
  otherKey: "employeeId",
  as: "Employees",
});

Employee.belongsToMany(EmployeeRole, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeId",
  otherKey: "employeeRoleId",
  as: "EmployeeRoles",
});

VehicleType.hasMany(Vehicle, {
  as: "Vehicle",
  foreignKey: "vehicleId",
  sourceKey: "vehicleId",
});
Vehicle.belongsTo(VehicleType, {
  as: "VehicleType",
  foreignKey: "vehicleId",
  targetKey: "vehicleId",
});

VehicleStatus.hasMany(VehicleLog, {
  as: "VehicleLog",
  foreignKey: "vehicleStatusId",
  sourceKey: "id",
});
VehicleLog.belongsTo(VehicleStatus, {
  as: "VehicleStatus",
  foreignKey: "vehicleStatusId",
  targetKey: "id",
});

Vehicle.hasMany(VehicleLog, {
  as: "VehicleLog",
  foreignKey: "plateNumber",
  sourceKey: "plateNumber",
});
VehicleLog.belongsTo(Vehicle, {
  as: "Vehicle",
  foreignKey: "plateNumber",
  targetKey: "plateNumber",
});

// Export the associations
module.exports = {
  Employee,
  EmployeeRole,
  User,
  TypeOfWaste,
  TreatmentProcess,
  VehicleType,
  Vehicle,
  Client,
  WasteCategory,
  TransactionStatus,
  VehicleStatus,
  VehicleLog,
};
