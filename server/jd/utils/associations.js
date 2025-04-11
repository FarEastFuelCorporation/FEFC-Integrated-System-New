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
const ProductLedgerJD = require("../models/ProductLedger");
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
  onDelete: "CASCADE",
});
ProductCategoryJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
EquipmentJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

EmployeeJD.hasMany(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
  onDelete: "CASCADE",
});
LedgerJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
  onDelete: "CASCADE",
});

ProductCategoryJD.hasMany(ProductJD, {
  as: "ProductJD",
  foreignKey: "productCategoryId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ProductJD.belongsTo(ProductCategoryJD, {
  as: "ProductCategoryJD",
  foreignKey: "productCategoryId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ProductJD.hasMany(ProductLedgerJD, {
  as: "ProductLedgerJD",
  foreignKey: "productId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ProductLedgerJD.belongsTo(ProductJD, {
  as: "ProductJD",
  foreignKey: "productId",
  targetKey: "id",
  onDelete: "CASCADE",
});

LedgerJD.hasMany(ProductLedgerJD, {
  as: "ProductLedgerJD",
  foreignKey: "transactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ProductLedgerJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

LedgerJD.hasMany(InventoryJD, {
  as: "InventoryJD",
  foreignKey: "transactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
InventoryJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

InventoryJD.hasMany(InventoryLedgerJD, {
  as: "InventoryLedgerJD",
  foreignKey: "inventoryId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
InventoryLedgerJD.belongsTo(InventoryJD, {
  as: "InventoryJD",
  foreignKey: "inventoryId",
  targetKey: "id",
  onDelete: "CASCADE",
});

LedgerJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "transactionId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
EquipmentJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
  onDelete: "CASCADE",
});

EquipmentJD.hasMany(EquipmentLedgerJD, {
  as: "EquipmentLedgerJD",
  foreignKey: "equipmentId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
EquipmentLedgerJD.belongsTo(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "equipmentId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ProductionJD.hasMany(InventoryLedgerJD, {
  as: "InventoryLedgerJD",
  foreignKey: "batchId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
InventoryLedgerJD.belongsTo(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "batchId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ProductionJD.hasMany(EquipmentLedgerJD, {
  as: "EquipmentLedgerJD",
  foreignKey: "batchId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
EquipmentLedgerJD.belongsTo(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "batchId",
  targetKey: "id",
  onDelete: "CASCADE",
});

ProductionJD.hasMany(ProductLedgerJD, {
  as: "ProductLedgerJD",
  foreignKey: "batchId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
ProductLedgerJD.belongsTo(ProductionJD, {
  as: "ProductionJD",
  foreignKey: "batchId",
  targetKey: "id",
  onDelete: "CASCADE",
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
