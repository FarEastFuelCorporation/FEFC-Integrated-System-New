// utils/associations.js

const EmployeeJD = require("../models/Employee");
const EmployeeRoleJD = require("../models/EmployeeRole");
const EmployeeRolesEmployeeJD = require("../models/EmployeeRolesEmployee");
const EquipmentJD = require("../models/Equipment");
const EquipmentLedgerJD = require("../models/EquipmentLedger");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");
const LedgerJD = require("../models/Ledger");
const ProductJD = require("../models/Product");
const ProductCategoryJD = require("../models/ProductCategory");
const ProductionJD = require("../models/Production");
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

EmployeeJD.hasMany(ProductCategoryJD, {
  as: "ProductCategoryJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "SET NULL",
});
ProductCategoryJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "SET NULL",
});

EmployeeJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "SET NULL",
});
EquipmentJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "SET NULL",
});

EmployeeJD.hasMany(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "SET NULL",
});
LedgerJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "SET NULL",
});

ProductCategoryJD.hasMany(ProductJD, {
  as: "ProductJD",
  foreignKey: "productCategoryId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
ProductJD.belongsTo(ProductCategoryJD, {
  as: "ProductCategoryJD",
  foreignKey: "productCategoryId",
  targetKey: "id",
  onDelete: "SET NULL",
});

ProductJD.hasMany(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "productId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
ProductionJD.belongsTo(ProductJD, {
  as: "ProductJD",
  foreignKey: "productId",
  targetKey: "id",
  onDelete: "SET NULL",
});

LedgerJD.hasMany(InventoryJD, {
  as: "InventoryJD",
  foreignKey: "transactionId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
InventoryJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
  onDelete: "SET NULL",
});

InventoryJD.hasMany(InventoryLedgerJD, {
  as: "InventoryLedgerJD",
  foreignKey: "inventoryId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
InventoryLedgerJD.belongsTo(InventoryJD, {
  as: "InventoryJD",
  foreignKey: "inventoryId",
  targetKey: "id",
  onDelete: "SET NULL",
});

LedgerJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "transactionId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
EquipmentJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
  onDelete: "SET NULL",
});

EquipmentJD.hasMany(EquipmentLedgerJD, {
  as: "EquipmentLedgerJD",
  foreignKey: "equipmentId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
EquipmentLedgerJD.belongsTo(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "equipmentId",
  targetKey: "id",
  onDelete: "SET NULL",
});

ProductionJD.hasMany(InventoryLedgerJD, {
  as: "InventoryLedgerJD",
  foreignKey: "batchId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
InventoryLedgerJD.belongsTo(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "batchId",
  targetKey: "id",
  onDelete: "SET NULL",
});

ProductionJD.hasMany(EquipmentLedgerJD, {
  as: "EquipmentLedgerJD",
  foreignKey: "batchId",
  sourceKey: "id",
  onDelete: "SET NULL",
});
EquipmentLedgerJD.belongsTo(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "batchId",
  targetKey: "id",
  onDelete: "SET NULL",
});

// Export the associations
module.exports = {
  EmployeeJD,
  EmployeeRoleJD,
  EmployeeRolesEmployeeJD,
  UserJD,
  ProductCategoryJD,
  EquipmentJD,
};
