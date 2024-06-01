// routes/hr_dashboard.js

const express = require('express');
const { getHrDashboardController } = require('../controllers/hrDashboardController');
const router = express.Router();

// Dashboard route
router.get('/', getHrDashboardController);

module.exports = router;