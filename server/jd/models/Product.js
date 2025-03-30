// models/Product.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductJD = sequelize.define(
  "ProductJD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    productCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = ProductJD;
