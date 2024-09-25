// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes
const authRoutes = require("./auth");
const othersRoutes = require("./others");
const geoTableRoutes = require("./geoTableRoutes");
const requestsRoutes = require("./requests");
const clientRoutes = require("./clientRoutes");
const documentRoutes = require("./documentRoutes");
const quotationRoutes = require("./quotationRoutes");
const quotationFormRoutes = require("./quotationFormRoutes");
const typeOfWasteRoutes = require("./typeOfWasteRoutes");
const treatmentProcessRoutes = require("./treatmentProcessRoutes");
const vehicleTypeRoutes = require("./vehicleTypeRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const vehicleMaintenanceRequestRoutes = require("./vehicleMaintenanceRequestRoutes");
const scrapTypeRoutes = require("./scrapTypeRoutes");
const treatmentMachineRoutes = require("./treatmentMachineRoutes");
const attachmentRoutes = require("./attachmentRoutes");
const bookedTransactionRoutes = require("./bookedTransactionRoutes");
const scheduledTransactionRoutes = require("./scheduledTransactionRoutes");
const dispatchedTransactionRoutes = require("./dispatchedTransactionRoutes");
const receivedTransactionRoutes = require("./receivedTransactionRoutes");
const sortedTransactionRoutes = require("./sortedTransactionRoutes");
const treatedTransactionRoutes = require("./treatedTransactionRoutes");
const certifiedTransactionRoutes = require("./certifiedTransactionRoutes");
const certificateRoutes = require("./certificateRoutes");
const hrDashboardRoutes = require("./hr_dashboard");
const employeeRoutes = require("./employeeRoutes");
const employeeRecordRoutes = require("./employeeRecordRoutes");
const employeeAttachmentRoutes = require("./employeeAttachmentRoutes");
const departmentRoutes = require("./departmentRoutes");
const { error404Controller } = require("../controllers/othersController");

// Route to check authentication status
router.get("/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.use(authRoutes);
router.use(othersRoutes);
router.use("/geoTable", geoTableRoutes);
router.use("/request", requestsRoutes);
router.use("/client", clientRoutes);
router.use("/document", documentRoutes);
router.use("/quotation", quotationRoutes);
router.use("/quotationForm", quotationFormRoutes);
router.use("/typeOfWaste", typeOfWasteRoutes);
router.use("/treatmentProcess", treatmentProcessRoutes);
router.use("/vehicleType", vehicleTypeRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/vehicleMaintenanceRequest", vehicleMaintenanceRequestRoutes);
router.use("/scrapType", scrapTypeRoutes);
router.use("/treatmentMachine", treatmentMachineRoutes);
router.use("/attachment", attachmentRoutes);
router.use("/bookedTransaction", bookedTransactionRoutes);
router.use("/scheduledTransaction", scheduledTransactionRoutes);
router.use("/dispatchedTransaction", dispatchedTransactionRoutes);
router.use("/receivedTransaction", receivedTransactionRoutes);
router.use("/sortedTransaction", sortedTransactionRoutes);
router.use("/treatedTransaction", treatedTransactionRoutes);
router.use("/certifiedTransaction", certifiedTransactionRoutes);
router.use("/certificate", certificateRoutes);
router.use("/hrDashboard", hrDashboardRoutes);
router.use("/employee", employeeRoutes);
router.use("/employeeRecord", employeeRecordRoutes);
router.use("/employeeAttachment", employeeAttachmentRoutes);
router.use("/department", departmentRoutes);

router.use(error404Controller);

module.exports = router;
