// utils/associations.js

const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const User = require("../models/User");
const TypeOfWaste = require("../models/TypeOfWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const VehicleType = require("../models/VehicleType");
const Vehicle = require("../models/Vehicle");
const Client = require("../models/Client");
const TransactionStatus = require("../models/TransactionStatus");
const VehicleLog = require("../models/VehicleLog");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const Quotation = require("../models/Quotation");
const QuotationWaste = require("../models/QuotationWaste");
const QuotationTransportation = require("../models/QuotationTransportation");
const ClientUser = require("../models/ClientUser");
const VehicleMaintenanceRequest = require("../models/VehicleMaintenanceRequest");
const BookedTransaction = require("../models/BookedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");

// Define associations
Client.hasMany(ClientUser, {
  as: "ClientUser",
  foreignKey: "clientId",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
ClientUser.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
  onDelete: "CASCADE",
});

Employee.hasMany(User, {
  as: "User",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
User.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(VehicleMaintenanceRequest, {
  as: "VehicleMaintenanceRequest",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
VehicleMaintenanceRequest.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRole.belongsToMany(Employee, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeRoleId",
  otherKey: "employeeId",
  as: "Employees",
  onDelete: "CASCADE",
});
Employee.belongsToMany(EmployeeRole, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeId",
  otherKey: "employeeRoleId",
  as: "EmployeeRoles",
  onDelete: "CASCADE",
});

VehicleType.hasMany(Vehicle, {
  as: "Vehicle",
  foreignKey: "vehicleTypeId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Vehicle.belongsTo(VehicleType, {
  as: "VehicleType",
  foreignKey: "vehicleTypeId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Vehicle.hasMany(VehicleLog, {
  as: "VehicleLog",
  foreignKey: "plateNumber",
  sourceKey: "plateNumber",
  onDelete: "CASCADE",
});
VehicleLog.belongsTo(Vehicle, {
  as: "Vehicle",
  foreignKey: "plateNumber",
  targetKey: "plateNumber",
  onDelete: "CASCADE",
});

Vehicle.hasMany(VehicleMaintenanceRequest, {
  as: "VehicleMaintenanceRequest",
  foreignKey: "plateNumber",
  sourceKey: "plateNumber",
  onDelete: "CASCADE",
});
VehicleMaintenanceRequest.belongsTo(Vehicle, {
  as: "Vehicle",
  foreignKey: "plateNumber",
  targetKey: "plateNumber",
  onDelete: "CASCADE",
});

TreatmentProcess.hasMany(TypeOfWaste, {
  as: "TypeOfWaste",
  foreignKey: "treatmentProcessId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TypeOfWaste.belongsTo(TreatmentProcess, {
  as: "TreatmentProcess",
  foreignKey: "treatmentProcessId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Client.hasMany(Quotation, {
  as: "Quotation",
  foreignKey: "clientId",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
Quotation.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
  onDelete: "CASCADE",
});

Quotation.hasMany(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "quotationId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationWaste.belongsTo(Quotation, {
  as: "Quotation",
  foreignKey: "quotationId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TypeOfWaste.hasMany(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "wasteId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationWaste.belongsTo(TypeOfWaste, {
  as: "TypeOfWaste",
  foreignKey: "wasteId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Quotation.hasMany(QuotationTransportation, {
  as: "QuotationTransportation",
  foreignKey: "quotationId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationTransportation.belongsTo(Quotation, {
  as: "Quotation",
  foreignKey: "quotationId",
  targetKey: "id",
  onDelete: "CASCADE",
});

VehicleType.hasMany(QuotationTransportation, {
  as: "QuotationTransportation",
  foreignKey: "vehicleId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationTransportation.belongsTo(VehicleType, {
  as: "VehicleType",
  foreignKey: "vehicleId",
  targetKey: "id",
  onDelete: "CASCADE",
});

QuotationWaste.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "quotationWasteId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BookedTransaction.belongsTo(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "quotationWasteId",
  targetKey: "id",
  onDelete: "CASCADE",
});

QuotationTransportation.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "quotationTransportationId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BookedTransaction.belongsTo(QuotationTransportation, {
  as: "QuotationTransportation",
  foreignKey: "quotationTransportationId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TransactionStatus.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "statusId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BookedTransaction.belongsTo(TransactionStatus, {
  as: "TransactionStatus",
  foreignKey: "statusId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BookedTransaction.hasMany(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "bookedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ScheduledTransaction.belongsTo(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "bookedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
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
  TransactionStatus,
  VehicleLog,
};
