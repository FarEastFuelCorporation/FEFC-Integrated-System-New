// models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
    'User', 
    {
        employeeId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    }
);

module.exports = User;
