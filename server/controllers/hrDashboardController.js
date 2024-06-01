// controllers/dispatchingDashboardControllers.js

require('dotenv').config();
const { Op, Sequelize } = require('sequelize');
const Employee = require("../models/Employee");

// Dashboard controller
async function getHrDashboardController(req, res) {
    try {
        // Retrieve data from the database or perform other logic
        const employeeId = req.session.employeeId;
        const employee = await Employee.findOne({ where: { employeeId } });
        
        // Render the dashboard view with data
        const viewsData = {
            pageTitle: 'HR User - Dashboard',
            sidebar: 'hr/hr_sidebar',
            content: 'hr/hr_dashboard',
            route: 'hr_dashboard',
            employee,
        };
        res.render('dashboard', viewsData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { 
    getHrDashboardController,
};