// utils/associations.js

const EmployeeJD = require("../models/Employee");
const EmployeeRoleJD = require("../models/EmployeeRole");
const EmployeeRolesEmployeeJD = require("../models/EmployeeRolesEmployee");
const EquipmentJD = require("../models/Equipment");
const InventoryJD = require("../models/Inventory");
const LedgerJD = require("../models/Ledger");
const ProductCategoryJD = require("../models/ProductCategory");
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
});
ProductCategoryJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

EmployeeJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
EquipmentJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

EmployeeJD.hasMany(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "createdBy",
  sourceKey: "employeeId",
});
LedgerJD.belongsTo(EmployeeJD, {
  as: "EmployeeJD",
  foreignKey: "createdBy",
  targetKey: "employeeId",
});

LedgerJD.hasMany(InventoryJD, {
  as: "InventoryJD",
  foreignKey: "transactionId",
  sourceKey: "id",
});
InventoryJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
});

LedgerJD.hasMany(EquipmentJD, {
  as: "EquipmentJD",
  foreignKey: "transactionId",
  sourceKey: "id",
});
EquipmentJD.belongsTo(LedgerJD, {
  as: "LedgerJD",
  foreignKey: "transactionId",
  targetKey: "id",
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
