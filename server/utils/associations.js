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
const DispatchedTransaction = require("../models/DispatchedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const ScrapType = require("../models/ScrapType");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");

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

Client.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "createdBy",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
BookedTransaction.belongsTo(Client, {
  as: "Client",
  foreignKey: "createdBy",
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

Employee.hasMany(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
ScheduledTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(DispatchedTransaction, {
  as: "DispatchedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
DispatchedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
ReceivedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
SortedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
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
  foreignKey: "vehicleTypeId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationTransportation.belongsTo(VehicleType, {
  as: "VehicleType",
  foreignKey: "vehicleTypeId",
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

ScheduledTransaction.hasMany(DispatchedTransaction, {
  as: "DispatchedTransaction",
  foreignKey: "scheduledTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
DispatchedTransaction.belongsTo(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "scheduledTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Vehicle.hasMany(DispatchedTransaction, {
  as: "DispatchedTransaction",
  foreignKey: "vehicleId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
DispatchedTransaction.belongsTo(Vehicle, {
  as: "Vehicle",
  foreignKey: "vehicleId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Employee.hasMany(DispatchedTransaction, {
  as: "DispatchedTransactionDriver",
  foreignKey: "driverId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
DispatchedTransaction.belongsTo(Employee, {
  as: "EmployeeDriver",
  foreignKey: "driverId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

DispatchedTransaction.hasMany(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "dispatchedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ReceivedTransaction.belongsTo(DispatchedTransaction, {
  as: "DispatchedTransaction",
  foreignKey: "dispatchedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ScheduledTransaction.hasMany(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "scheduledTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ReceivedTransaction.belongsTo(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "scheduledTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ReceivedTransaction.hasMany(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "receivedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedTransaction.belongsTo(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "receivedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

SortedTransaction.hasMany(SortedWasteTransaction, {
  as: "SortedWasteTransaction",
  foreignKey: "sortedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedWasteTransaction.belongsTo(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "sortedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

SortedTransaction.hasMany(SortedScrapTransaction, {
  as: "SortedScrapTransaction",
  foreignKey: "sortedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedScrapTransaction.belongsTo(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "sortedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ScrapType.hasMany(SortedScrapTransaction, {
  as: "SortedScrapTransaction",
  foreignKey: "scrapTypeId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedScrapTransaction.belongsTo(ScrapType, {
  as: "ScrapType",
  foreignKey: "scrapTypeId",
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
