// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes
const authRoutes = require("./auth");
const othersRoutes = require("./others");
const attendanceRoutes = require("./attendanceRoutes");
const travelOrderRoutes = require("./travelOrderRoutes");
const travelOrderVerifyRoutes = require("./travelOrderVerifyRoutes");
const leaveRoutes = require("./leaveRoutes");
const overtimeRoutes = require("./overtimeRoutes");
const workScheduleRoutes = require("./workScheduleRoutes");
const switchUserRoutes = require("./switchUserRoutes");
const geoTableRoutes = require("./geoTableRoutes");
const requestsRoutes = require("./requests");
const clientRoutes = require("./clientRoutes");
const transporterClientRoutes = require("./transporterClientRoutes");
const documentRoutes = require("./documentRoutes");
const logisticsRoutes = require("./logisticsRoutes");
const quotationRoutes = require("./quotationRoutes");
const quotationFormRoutes = require("./quotationFormRoutes");
const typeOfWasteRoutes = require("./typeOfWasteRoutes");
const treatmentProcessRoutes = require("./treatmentProcessRoutes");
const vehicleTypeRoutes = require("./vehicleTypeRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const vehicleAttachmentRoutes = require("./vehicleAttachmentRoutes");
const vehicleMaintenanceRequestRoutes = require("./vehicleMaintenanceRequestRoutes");
const scrapTypeRoutes = require("./scrapTypeRoutes");
const treatmentMachineRoutes = require("./treatmentMachineRoutes");
const attachmentRoutes = require("./attachmentRoutes");
const bookedTransactionRoutes = require("./bookedTransactionRoutes");
const scheduledTransactionRoutes = require("./scheduledTransactionRoutes");
const dispatchedTransactionRoutes = require("./dispatchedTransactionRoutes");
const vehicleLocationRoutes = require("./vehicleLocationRoutes");
const receivedTransactionRoutes = require("./receivedTransactionRoutes");
const sortedTransactionRoutes = require("./sortedTransactionRoutes");
const warehousedTransactionRoutes = require("./warehousedTransactionRoutes");
const warehousedOutTransactionRoutes = require("./warehousedOutTransactionRoutes");
const treatedTransactionRoutes = require("./treatedTransactionRoutes");
const certifiedTransactionRoutes = require("./certifiedTransactionRoutes");
const certificateRoutes = require("./certificateRoutes");
const plasticTransactionRoutes = require("./plasticTransactionRoutes");
const billedTransactionRoutes = require("./billedTransactionRoutes");
const billingRoutes = require("./billingRoutes");
const commissionVerifyRoutes = require("./commissionVerifyRoutes");
const billingApprovalTransactionRoutes = require("./billingApprovalTransactionRoutes");
const billingDistributionTransactionRoutes = require("./billingDistributionTransactionRoutes");
const collectionTransactionRoutes = require("./collectionTransactionRoutes");
const hrDashboardRoutes = require("./hr_dashboard");
const employeeRoutes = require("./employeeRoutes");
const employeeRecordRoutes = require("./employeeRecordRoutes");
const payrollRoutes = require("./payrollRoutes");
const employeeSalaryRoutes = require("./employeeSalaryRoutes");
const attendanceRecordRoutes = require("./attendanceRecordRoutes");
const employeeAttachmentRoutes = require("./employeeAttachmentRoutes");
const employeeAttachmentLegalRoutes = require("./employeeAttachmentLegalRoutes");
const employeeAttachmentMemoRoutes = require("./employeeAttachmentMemoRoutes");
const departmentRoutes = require("./departmentRoutes");
const medicineRoutes = require("./medicineRoutes");
const medicineLogRoutes = require("./medicineLogRoutes");
const truckScaleRoutes = require("./truckScaleRoutes");
const truckScaleVIewRoutes = require("./truckScaleVIewRoutes");
const gatePassRoutes = require("./gatePassRoutes");
const pttRoutes = require("./pttRoutes");
const agentRoutes = require("./agentRoutes");
const commissionRoutes = require("./commissionRoutes");
const commissionedTransactionRoutes = require("./commissionedTransactionRoutes");
const { error404Controller } = require("../controllers/othersController");

router.use(authRoutes);
router.use(othersRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/certificate", certificateRoutes);
router.use("/truckScaleView", truckScaleVIewRoutes);
router.use("/billing", billingRoutes);
router.use("/commissionVerify", commissionVerifyRoutes);
router.use("/quotationForm", quotationFormRoutes);

// Route to check authentication status
router.get("/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.use("/travelOrder", travelOrderRoutes);
router.use("/travelOrderVerify", travelOrderVerifyRoutes);
router.use("/leave", leaveRoutes);
router.use("/overtime", overtimeRoutes);
router.use("/workSchedule", workScheduleRoutes);
router.use("/switchUser", switchUserRoutes);
router.use("/geoTable", geoTableRoutes);
router.use("/request", requestsRoutes);
router.use("/client", clientRoutes);
router.use("/transporterClient", transporterClientRoutes);
router.use("/document", documentRoutes);
router.use("/logistics", logisticsRoutes);
router.use("/quotation", quotationRoutes);
router.use("/typeOfWaste", typeOfWasteRoutes);
router.use("/treatmentProcess", treatmentProcessRoutes);
router.use("/vehicleType", vehicleTypeRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/vehicleAttachment", vehicleAttachmentRoutes);
router.use("/vehicleMaintenanceRequest", vehicleMaintenanceRequestRoutes);
router.use("/scrapType", scrapTypeRoutes);
router.use("/treatmentMachine", treatmentMachineRoutes);
router.use("/attachment", attachmentRoutes);
router.use("/bookedTransaction", bookedTransactionRoutes);
router.use("/scheduledTransaction", scheduledTransactionRoutes);
router.use("/dispatchedTransaction", dispatchedTransactionRoutes);
router.use("/vehicleLocation", vehicleLocationRoutes);
router.use("/receivedTransaction", receivedTransactionRoutes);
router.use("/sortedTransaction", sortedTransactionRoutes);
router.use("/warehousedTransaction", warehousedTransactionRoutes);
router.use("/warehousedOutTransaction", warehousedOutTransactionRoutes);
router.use("/treatedTransaction", treatedTransactionRoutes);
router.use("/certifiedTransaction", certifiedTransactionRoutes);
router.use("/plasticTransaction", plasticTransactionRoutes);
router.use("/billedTransaction", billedTransactionRoutes);
router.use("/billingApprovalTransaction", billingApprovalTransactionRoutes);
router.use(
  "/billingDistributionTransaction",
  billingDistributionTransactionRoutes
);
router.use("/collectionTransaction", collectionTransactionRoutes);
router.use("/hrDashboard", hrDashboardRoutes);
router.use("/employee", employeeRoutes);
router.use("/employeeRecord", employeeRecordRoutes);
router.use("/payroll", payrollRoutes);
router.use("/employeeSalary", employeeSalaryRoutes);
router.use("/attendanceRecord", attendanceRecordRoutes);
router.use("/employeeAttachment", employeeAttachmentRoutes);
router.use("/employeeAttachmentLegal", employeeAttachmentLegalRoutes);
router.use("/employeeAttachmentMemo", employeeAttachmentMemoRoutes);
router.use("/department", departmentRoutes);
router.use("/medicine", medicineRoutes);
router.use("/medicineLog", medicineLogRoutes);
router.use("/truckScale", truckScaleRoutes);
router.use("/gatePass", gatePassRoutes);
router.use("/ptt", pttRoutes);
router.use("/agent", agentRoutes);
router.use("/commission", commissionRoutes);
router.use("/commissionedTransaction", commissionedTransactionRoutes);

router.use(error404Controller);

module.exports = router;
