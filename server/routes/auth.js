// routes/auth.js

const express = require("express");
const router = express.Router();

const {
  postLoginController,
  postSignupController,
} = require("../controllers/authController");

router.post("/signup", postSignupController);

// Handle login form submission
router.post("/login", postLoginController);

module.exports = router;
