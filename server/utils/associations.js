// utils/associations.js

const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee");
const EmployeeRolesOtherRole = require("../models/EmployeeRolesOtherRole");
const User = require("../models/User");
const TypeOfWaste = require("../models/TypeOfWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const VehicleType = require("../models/VehicleType");
const Vehicle = require("../models/Vehicle");
const Client = require("../models/Client");
const TransactionStatus = require("../models/TransactionStatus");
const VehicleLog = require("../models/VehicleLog");
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
const TreatmentMachine = require("../models/TreatmentMachine");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const Attachment = require("../models/Attachment");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const GeoTable = require("../models/GeoTable");
const Department = require("../models/Department");
const EmployeeRecord = require("../models/EmployeeRecord");
const EmployeeAttachment = require("../models/EmployeeAttachment");
const IdInformation = require("../models/IdInformation");
const Document = require("../models/Document");
const BilledTransaction = require("../models/BilledTransaction");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");
const CollectedTransaction = require("../models/CollectedTransaction");
const Logistics = require("../models/Logistics");
const WarehousedTransaction = require("../models/WarehousedTransaction");
const WarehousedTransactionItem = require("../models/WarehousedTransactionItem");
const PlasticTransaction = require("../models/PlasticTransaction");
const PlasticInventory = require("../models/PlasticInventory");
const Attendance = require("../models/Attendance");
const ViolationList = require("../models/ViolationList");
const Violation = require("../models/Violation");
const TravelOrder = require("../models/TravelOrder");
const Leave = require("../models/Leave");
const WorkSchedule = require("../models/WorkSchedule");
const Overtime = require("../models/Overtime");
const EmployeeSalary = require("../models/EmployeeSalary");
const VehicleAttachment = require("../models/VehicleAttachment");
const TransporterClient = require("../models/TransporterClient");
const Medicine = require("../models/Medicine");
const MedicineLog = require("../models/MedicineLog");
const WarehousedOutTransaction = require("../models/WarehousedOutTransaction");
const WarehousedOutTransactionItem = require("../models/WarehousedOutTransactionItem");
const EmployeeAttachmentLegal = require("../models/EmployeeAttachmentLegal");
const EmployeeAttachmentMemo = require("../models/EmployeeAttachmentMemo");
const TruckScale = require("../models/TruckScale");
const GatePass = require("../models/GatePass");
const GatePassItem = require("../models/GatePassItem");
const PTTWaste = require("../models/PTTWaste");
const PTT = require("../models/PTT");
const PTTWasteLog = require("../models/PTTWasteLog");
const CommissionWaste = require("../models/CommissionWaste");
const Commission = require("../models/Commission");
const EmployeeTimeRecord = require("../models/EmployeeTimeRecord");
const CommissionedTransaction = require("../models/CommissionedTransaction");
const Agent = require("../models/Agent");
const ClientAttachment = require("../models/ClientAttachment");
const EmployeeAttachmentCertificate = require("../models/EmployeeAttachmentCertificate");
const EmployeeAttachmentIncident = require("../models/EmployeeAttachmentIncident");
const EmployeeContract = require("../models/EmployeeContract");

// Define associations
IdInformation.hasMany(Attendance, {
  as: "attendances",
  foreignKey: "employee_id",
  sourceKey: "employee_id",
});
Attendance.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "employee_id",
  targetKey: "employee_id",
});

ViolationList.hasMany(Violation, {
  as: "Violation",
  foreignKey: "violation_id",
  sourceKey: "violation_id",
});
Violation.belongsTo(ViolationList, {
  as: "ViolationList",
  foreignKey: "violation_id",
  targetKey: "violation_id",
});

Department.hasMany(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "departmentId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
EmployeeRecord.belongsTo(Department, {
  as: "Department",
  foreignKey: "departmentId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Department.hasMany(EmployeeContract, {
  as: "EmployeeContract",
  foreignKey: "departmentId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
EmployeeContract.belongsTo(Department, {
  as: "Department",
  foreignKey: "departmentId",
  targetKey: "id",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeContract, {
  as: "EmployeeContract",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeContract.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeContract, {
  as: "EmployeeContractCreatedBy",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeContract.belongsTo(EmployeeRecord, {
  as: "EmployeeRecordCreatedBy",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeAttachment, {
  as: "EmployeeAttachment",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachment.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeAttachmentLegal, {
  as: "EmployeeAttachmentLegal",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentLegal.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeAttachmentMemo, {
  as: "EmployeeAttachmentMemo",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentMemo.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeAttachmentCertificate, {
  as: "EmployeeAttachmentCertificate",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentCertificate.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRecord.hasMany(EmployeeAttachmentIncident, {
  as: "EmployeeAttachmentIncident",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentIncident.belongsTo(EmployeeRecord, {
  as: "EmployeeRecord",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeAttachment, {
  as: "EmployeeAttachment",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachment.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeAttachmentLegal, {
  as: "EmployeeAttachmentLegal",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentLegal.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeAttachmentMemo, {
  as: "EmployeeAttachmentMemo",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentMemo.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeAttachmentCertificate, {
  as: "EmployeeAttachmentCertificate",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentCertificate.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeAttachmentIncident, {
  as: "EmployeeAttachmentIncident",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeAttachmentIncident.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Vehicle.hasMany(VehicleAttachment, {
  as: "VehicleAttachment",
  foreignKey: "plateNumber",
  sourceKey: "plateNumber",
  onDelete: "CASCADE",
});
VehicleAttachment.belongsTo(Vehicle, {
  as: "Vehicle",
  foreignKey: "plateNumber",
  targetKey: "plateNumber",
  onDelete: "CASCADE",
});

Employee.hasMany(VehicleAttachment, {
  as: "VehicleAttachment",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
VehicleAttachment.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

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

Client.hasMany(ClientAttachment, {
  as: "ClientAttachment",
  foreignKey: "clientId",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
ClientAttachment.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
  onDelete: "CASCADE",
});

Employee.hasMany(ClientAttachment, {
  as: "ClientAttachment",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
ClientAttachment.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Client.hasMany(TransporterClient, {
  as: "TransporterClient",
  foreignKey: "createdBy",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
TransporterClient.belongsTo(Client, {
  as: "Client",
  foreignKey: "createdBy",
  targetKey: "clientId",
  onDelete: "CASCADE",
});

TransporterClient.hasMany(SortedWasteTransaction, {
  as: "SortedWasteTransaction",
  foreignKey: "transporterClientId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedWasteTransaction.belongsTo(TransporterClient, {
  as: "TransporterClient",
  foreignKey: "transporterClientId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Client.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "createdBy",
  sourceKey: "clientId",
  onDelete: "SET NULL", // Change from CASCADE to SET NULL
});

BookedTransaction.belongsTo(Client, {
  as: "Client",
  foreignKey: "createdBy",
  targetKey: "clientId",
  onDelete: "SET NULL", // Change from CASCADE to SET NULL
});

TransporterClient.hasMany(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "transporterClientId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BookedTransaction.belongsTo(TransporterClient, {
  as: "TransporterClient",
  foreignKey: "transporterClientId",
  targetKey: "id",
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

Employee.hasMany(TravelOrder, {
  as: "TravelOrder",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
TravelOrder.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(Leave, {
  as: "Leave",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
Leave.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

IdInformation.hasMany(WorkSchedule, {
  as: "WorkSchedule",
  foreignKey: "employeeId",
  sourceKey: "employee_id",
  onDelete: "CASCADE",
});
WorkSchedule.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "employeeId",
  targetKey: "employee_id",
  onDelete: "CASCADE",
});

IdInformation.hasMany(WorkSchedule, {
  as: "WorkScheduleCreatedBy",
  foreignKey: "createdBy",
  sourceKey: "employee_id",
  onDelete: "CASCADE",
});
WorkSchedule.belongsTo(IdInformation, {
  as: "IdInformationCreatedBy",
  foreignKey: "createdBy",
  targetKey: "employee_id",
  onDelete: "CASCADE",
});

Employee.hasMany(Overtime, {
  as: "Overtime",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
Overtime.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(Overtime, {
  as: "OvertimeApprovedBy",
  foreignKey: "approvedBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
Overtime.belongsTo(Employee, {
  as: "EmployeeApprovedBy",
  foreignKey: "approvedBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeSalary, {
  as: "EmployeeSalary",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeSalary.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeSalary, {
  as: "EmployeeCreatedBy",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeSalary.belongsTo(Employee, {
  as: "EmployeeSalaryCreatedBy",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.hasMany(EmployeeRolesOtherRole, {
  as: "EmployeeRolesOtherRole",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EmployeeRolesOtherRole.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeRole.hasMany(EmployeeRolesOtherRole, {
  as: "EmployeeRolesOtherRole",
  foreignKey: "employeeRoleId",
  sourceKey: "employeeRoleId",
  onDelete: "CASCADE",
});
EmployeeRolesOtherRole.belongsTo(EmployeeRole, {
  as: "EmployeeRole",
  foreignKey: "employeeRoleId",
  targetKey: "employeeRoleId",
  onDelete: "CASCADE",
});

Employee.hasMany(VehicleMaintenanceRequest, {
  as: "VehicleMaintenanceRequest",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
VehicleMaintenanceRequest.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

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

IdInformation.hasMany(Quotation, {
  as: "Quotation",
  foreignKey: "createdBy",
  sourceKey: "employee_id",
});
Quotation.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "createdBy",
  targetKey: "employee_id",
});

Employee.hasMany(Attachment, {
  as: "Attachment",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
Attachment.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(Client, {
  as: "Client",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
Client.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(Document, {
  as: "Document",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
Document.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
ScheduledTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(DispatchedTransaction, {
  as: "DispatchedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
DispatchedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
ReceivedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
SortedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(TreatedTransaction, {
  as: "TreatedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
TreatedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(CertifiedTransaction, {
  as: "CertifiedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
CertifiedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(BilledTransaction, {
  as: "BilledTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
BilledTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

IdInformation.hasMany(CommissionedTransaction, {
  as: "CommissionedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employee_id",
});
CommissionedTransaction.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "createdBy",
  targetKey: "employee_id",
});

Employee.hasMany(BillingApprovalTransaction, {
  as: "BillingApprovalTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
BillingApprovalTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(BillingDistributionTransaction, {
  as: "BillingDistributionTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
BillingDistributionTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(CollectedTransaction, {
  as: "CollectedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
CollectedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
WarehousedTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(WarehousedOutTransaction, {
  as: "WarehousedOutTransaction",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
WarehousedOutTransaction.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(Medicine, {
  as: "Medicine",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
Medicine.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(MedicineLog, {
  as: "MedicineLog",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
MedicineLog.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(MedicineLog, {
  as: "EmployeeMedicineLog",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
});
MedicineLog.belongsTo(Employee, {
  as: "MedicineLogEmployee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
});

Employee.hasMany(TruckScale, {
  as: "TruckScale",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
TruckScale.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

Employee.hasMany(TruckScale, {
  as: "TruckScale2",
  foreignKey: "updatedBy",
  sourceKey: "employeeId",
});
TruckScale.belongsTo(Employee, {
  as: "Employee2",
  foreignKey: "updatedBy",
  targetKey: "employeeId",
});

Employee.hasMany(GatePass, {
  as: "GatePass",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
GatePass.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

GatePass.hasMany(GatePassItem, {
  as: "GatePassItem",
  foreignKey: "gatePassId",
  sourceKey: "id",
});
GatePassItem.belongsTo(GatePass, {
  as: "GatePass",
  foreignKey: "gatePassId",
  targetKey: "id",
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

TreatmentProcess.hasMany(TreatmentMachine, {
  as: "TreatmentMachine",
  foreignKey: "treatmentProcessId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatmentMachine.belongsTo(TreatmentProcess, {
  as: "TreatmentProcess",
  foreignKey: "treatmentProcessId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TreatmentProcess.hasMany(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "treatmentProcessId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
QuotationWaste.belongsTo(TreatmentProcess, {
  as: "TreatmentProcess",
  foreignKey: "treatmentProcessId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Client.hasMany(Quotation, {
  as: "Quotation",
  foreignKey: "clientId",
  sourceKey: "clientId",
  onDelete: "SET NULL",
});
Quotation.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
  onDelete: "SET NULL",
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

QuotationWaste.hasMany(SortedWasteTransaction, {
  as: "SortedWasteTransaction",
  foreignKey: "quotationWasteId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedWasteTransaction.belongsTo(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "quotationWasteId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TreatmentProcess.hasMany(SortedWasteTransaction, {
  as: "SortedWasteTransaction",
  foreignKey: "treatmentProcessId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
SortedWasteTransaction.belongsTo(TreatmentProcess, {
  as: "TreatmentProcess",
  foreignKey: "treatmentProcessId",
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

BookedTransaction.hasMany(Attachment, {
  as: "Attachment",
  foreignKey: "bookedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Attachment.belongsTo(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "bookedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Logistics.hasMany(ScheduledTransaction, {
  as: "ScheduledTransaction",
  foreignKey: "logisticsId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ScheduledTransaction.belongsTo(Logistics, {
  as: "Logistics",
  foreignKey: "logisticsId",
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
});
DispatchedTransaction.belongsTo(Employee, {
  as: "EmployeeDriver",
  foreignKey: "driverId",
  targetKey: "employeeId",
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

ReceivedTransaction.hasMany(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "receivedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedTransaction.belongsTo(ReceivedTransaction, {
  as: "ReceivedTransaction",
  foreignKey: "receivedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransaction.hasMany(WarehousedTransactionItem, {
  as: "WarehousedTransactionItem",
  foreignKey: "warehousedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedTransactionItem.belongsTo(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "warehousedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransaction.hasMany(WarehousedOutTransaction, {
  as: "WarehousedOutTransaction",
  foreignKey: "warehousedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedOutTransaction.belongsTo(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "warehousedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedOutTransaction.hasMany(WarehousedOutTransactionItem, {
  as: "WarehousedOutTransactionItem",
  foreignKey: "warehousedOutTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedOutTransactionItem.belongsTo(WarehousedOutTransaction, {
  as: "WarehousedOutTransaction",
  foreignKey: "warehousedOutTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransactionItem.hasMany(WarehousedOutTransactionItem, {
  as: "WarehousedTransactionItemToOut",
  foreignKey: "warehousedTransactionItemId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedOutTransactionItem.belongsTo(WarehousedTransactionItem, {
  as: "WarehousedTransactionItem",
  foreignKey: "warehousedTransactionItemId",
  targetKey: "id",
  onDelete: "CASCADE",
});

QuotationWaste.hasMany(WarehousedTransactionItem, {
  as: "WarehousedTransactionItem",
  foreignKey: "quotationWasteId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
WarehousedTransactionItem.belongsTo(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "quotationWasteId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransaction.hasMany(TreatedTransaction, {
  as: "TreatedTransaction",
  foreignKey: "warehousedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedTransaction.belongsTo(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "warehousedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransactionItem.hasMany(TreatedWasteTransaction, {
  as: "TreatedWasteTransaction",
  foreignKey: "warehousedTransactionItemId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedWasteTransaction.belongsTo(WarehousedTransactionItem, {
  as: "WarehousedTransactionItem",
  foreignKey: "warehousedTransactionItemId",
  targetKey: "id",
  onDelete: "CASCADE",
});

SortedTransaction.hasMany(TreatedTransaction, {
  as: "TreatedTransaction",
  foreignKey: "sortedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedTransaction.belongsTo(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "sortedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TreatedTransaction.hasMany(TreatedWasteTransaction, {
  as: "TreatedWasteTransaction",
  foreignKey: "treatedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedWasteTransaction.belongsTo(TreatedTransaction, {
  as: "TreatedTransaction",
  foreignKey: "treatedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

SortedWasteTransaction.hasMany(TreatedWasteTransaction, {
  as: "TreatedWasteTransaction",
  foreignKey: "sortedWasteTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedWasteTransaction.belongsTo(SortedWasteTransaction, {
  as: "SortedWasteTransaction",
  foreignKey: "sortedWasteTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TreatmentProcess.hasMany(TreatedWasteTransaction, {
  as: "TreatedWasteTransaction",
  foreignKey: "treatmentProcessId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedWasteTransaction.belongsTo(TreatmentProcess, {
  as: "TreatmentProcess",
  foreignKey: "treatmentProcessId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TreatmentMachine.hasMany(TreatedWasteTransaction, {
  as: "TreatedWasteTransaction",
  foreignKey: "treatmentMachineId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
TreatedWasteTransaction.belongsTo(TreatmentMachine, {
  as: "TreatmentMachine",
  foreignKey: "treatmentMachineId",
  targetKey: "id",
  onDelete: "CASCADE",
});

WarehousedTransaction.hasMany(CertifiedTransaction, {
  as: "CertifiedTransaction",
  foreignKey: "warehousedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CertifiedTransaction.belongsTo(WarehousedTransaction, {
  as: "WarehousedTransaction",
  foreignKey: "warehousedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

SortedTransaction.hasMany(CertifiedTransaction, {
  as: "CertifiedTransaction",
  foreignKey: "sortedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CertifiedTransaction.belongsTo(SortedTransaction, {
  as: "SortedTransaction",
  foreignKey: "sortedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BookedTransaction.hasMany(CertifiedTransaction, {
  as: "CertifiedTransaction",
  foreignKey: "bookedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CertifiedTransaction.belongsTo(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "bookedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BookedTransaction.hasMany(BilledTransaction, {
  as: "BilledTransaction",
  foreignKey: "bookedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BilledTransaction.belongsTo(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "bookedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BookedTransaction.hasMany(CommissionedTransaction, {
  as: "CommissionedTransaction",
  foreignKey: "bookedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CommissionedTransaction.belongsTo(BookedTransaction, {
  as: "BookedTransaction",
  foreignKey: "bookedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BilledTransaction.hasOne(BillingApprovalTransaction, {
  as: "BillingApprovalTransaction",
  foreignKey: "billedTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BillingApprovalTransaction.belongsTo(BilledTransaction, {
  as: "BilledTransaction",
  foreignKey: "billedTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BillingApprovalTransaction.hasOne(BillingDistributionTransaction, {
  as: "BillingDistributionTransaction",
  foreignKey: "billingApprovalTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
BillingDistributionTransaction.belongsTo(BillingApprovalTransaction, {
  as: "BillingApprovalTransaction",
  foreignKey: "billingApprovalTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

BillingDistributionTransaction.hasOne(CollectedTransaction, {
  as: "CollectedTransaction",
  foreignKey: "billingDistributionTransactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CollectedTransaction.belongsTo(BillingDistributionTransaction, {
  as: "BillingDistributionTransaction",
  foreignKey: "billingDistributionTransactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Client.hasMany(PlasticInventory, {
  as: "PlasticInventory",
  foreignKey: "clientId",
  sourceKey: "clientId",
});
PlasticInventory.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
});

Client.hasMany(PlasticTransaction, {
  as: "PlasticTransaction",
  foreignKey: "clientId",
  sourceKey: "clientId",
});
PlasticTransaction.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
});

Medicine.hasMany(MedicineLog, {
  as: "MedicineLog",
  foreignKey: "medicineId",
  sourceKey: "id",
});
MedicineLog.belongsTo(Medicine, {
  as: "Medicine",
  foreignKey: "medicineId",
  targetKey: "id",
});

Client.hasMany(PTT, {
  as: "PTT",
  foreignKey: "clientId",
  sourceKey: "clientId",
});
PTT.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
});

PTT.hasMany(PTTWaste, {
  as: "PTTWaste",
  foreignKey: "pttId",
  sourceKey: "id",
});
PTTWaste.belongsTo(PTT, {
  as: "PTT",
  foreignKey: "pttId",
  targetKey: "id",
});

TypeOfWaste.hasMany(PTTWaste, {
  as: "PTTWaste",
  foreignKey: "wasteId",
  sourceKey: "id",
});
PTTWaste.belongsTo(TypeOfWaste, {
  as: "TypeOfWaste",
  foreignKey: "wasteId",
  targetKey: "id",
});

PTTWaste.hasMany(PTTWasteLog, {
  as: "PTTWasteLog",
  foreignKey: "pttWasteId",
  sourceKey: "id",
});
PTTWasteLog.belongsTo(PTTWaste, {
  as: "PTTWaste",
  foreignKey: "pttWasteId",
  targetKey: "id",
});

Commission.hasMany(CommissionWaste, {
  as: "CommissionWaste",
  foreignKey: "commissionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CommissionWaste.belongsTo(Commission, {
  as: "Commission",
  foreignKey: "commissionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

QuotationWaste.hasMany(CommissionWaste, {
  as: "CommissionWaste",
  foreignKey: "quotationWasteId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CommissionWaste.belongsTo(QuotationWaste, {
  as: "QuotationWaste",
  foreignKey: "quotationWasteId",
  targetKey: "id",
  onDelete: "CASCADE",
});

Agent.hasMany(Commission, {
  as: "Commission",
  foreignKey: "agentId",
  sourceKey: "agentId",
  onDelete: "CASCADE",
});
Commission.belongsTo(Agent, {
  as: "Agent",
  foreignKey: "agentId",
  targetKey: "agentId",
  onDelete: "CASCADE",
});

// EmployeeRecord.hasMany(EmployeeTimeRecord, {
//   as: "EmployeeTimeRecord",
//   foreignKey: "employeeId",
//   sourceKey: "employeeId",
//   onDelete: "SET NULL",
// });
// EmployeeTimeRecord.belongsTo(EmployeeRecord, {
//   as: "EmployeeRecord",
//   foreignKey: "employeeId",
//   targetKey: "employeeId",
//   onDelete: "SET NULL",
// });

Client.hasMany(Commission, {
  as: "Commission",
  foreignKey: "clientId",
  sourceKey: "clientId",
  onDelete: "CASCADE",
});
Commission.belongsTo(Client, {
  as: "Client",
  foreignKey: "clientId",
  targetKey: "clientId",
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
  GeoTable,
};
