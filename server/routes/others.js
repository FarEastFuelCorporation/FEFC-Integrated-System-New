// routes/others.js

const express = require("express");
const { logoutController } = require("../controllers/othersController");
const router = express.Router();

router.get("/logout", logoutController);

module.exports = router;
