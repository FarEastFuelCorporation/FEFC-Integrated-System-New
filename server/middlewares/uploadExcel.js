// middleware/uploadExcel.js
const multer = require("multer");

const storage = multer.memoryStorage(); // Keep in memory to use with xlsx
const upload = multer({ storage });

module.exports = upload;
