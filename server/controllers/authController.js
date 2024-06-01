// controllers/authController.js

const Employee = require("../models/Employee");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const User = require("../models/User");
const bcrypt = require('bcrypt')

async function getSignupController(req, res){
    try {
        const viewsData = {
            pageTitle: 'Sign Up',
        };
        res.render('signup', viewsData); // Assuming you have a signup.ejs file in your views folder    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Example controller function for handling signup
async function postSignupController(req, res) {
    try {
        const { employeeId, password } = req.body;
        // Check if the employeeId is in the Employee table
        const existingEmployee = await Employee.findOne({ where: { employeeId } });

        if (!existingEmployee) {
            // Employee ID is not valid, render the signup page with an error message
            const viewsData = {
                pageTitle: 'Sign Up',
                error: 'Invalid Employee ID'
            };
            res.render('signup', viewsData);
            return;
        }

        // Check if the employeeId is already registered in the User table
        const existingUser = await User.findOne({ where: { employeeId } });

        if (existingUser) {
            // Employee is already registered, render the signup page with an error message
            const viewsData = {
                pageTitle: 'Sign Up',
                error: 'Employee is already registered'
            };
            res.render('signup', viewsData);
        } else {
            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user in the User table
            const newUser = await User.create({ employeeId, password: hashedPassword });

            // Set session data or other authentication mechanisms if needed

            // Redirect to a dashboard or home page after successful sign-up
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getLoginController(req, res){
    try {
        const viewsData = {
            pageTitle: 'Login',
        };
        res.render('login', viewsData); // Assuming you have a login.ejs file in your views folder    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Example controller function for handling login
async function postLoginController(req, res) {
    const { employeeId, password } = req.body;
    try {
        // Find the user with the provided employee ID
        const user = await User.findOne({ 
            where: { employeeId },
        });

        // Check if the user exists
        if (!user) {
            const viewsData = {
                pageTitle: 'Login',
                error: 'Invalid employee ID or password',
            };
            return res.render('login', viewsData);
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            const viewsData = {
                pageTitle: 'Login',
                error: 'Invalid employee ID or password',
            };
            return res.render('login', viewsData);
        }

        // Find the user's role(s) from the EmployeeRolesEmployee table
        const employeeRoles = await EmployeeRolesEmployee.findAll({ 
            where: { employeeId },
        });

        // Assuming a user can have multiple roles, handle each role accordingly
        let redirected = false;
        for (const role of employeeRoles) {
            if (role.employeeRoleId === 2) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/marketing_dashboard`);
                redirected = true;
                break;
            } else if (role.employeeRoleId === 3) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/dispatching_dashboard`);
                redirected = true;
                break;
            } else if (role.employeeRoleId === 4) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/receiving_dashboard`);
                redirected = true;
                break;
            } else if (role.employeeRoleId === 9) {
                req.session.employeeId = user.employeeId;
                res.redirect(`/hr_dashboard`);
                redirected = true;
                break;
            }
        }

        // If no role matched, redirect to a default route
        if (!redirected) {
            res.redirect(`/`);
        }

    } catch (error) {
        console.error('Error:', error);
        // Handle errors gracefully, redirect to an error page, or display a generic error message
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getSignupController, postLoginController, getLoginController, postSignupController };