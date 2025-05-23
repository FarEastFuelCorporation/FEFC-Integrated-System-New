// controllers/commissionedTransactionController.js

const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment"); // Ensure you have moment.js installed
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const CommissionedTransaction = require("../models/CommissionedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const Vehicle = require("../models/Vehicle");
const QuotationTransportation = require("../models/QuotationTransportation");
const VehicleType = require("../models/VehicleType");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const {
  ScheduleTransactionEmailFormat,
  ScheduleTransactionEmailToLogisticsFormat,
  BillingApprovalEmailFormat,
  CommissionApprovalEmailFormat,
} = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");
const QuotationWaste = require("../models/QuotationWaste");
const generateCommissionNumber = require("../utils/generateCommissionNumber");
const Commission = require("../models/Commission");
const Agent = require("../models/Agent");
const BilledTransaction = require("../models/BilledTransaction");
const statusId = 10;
const additionalStatusId = [11, 12, 13];

// Function to get the start and end dates of the last 8 weeks
function getLast8Weeks() {
  const weeks = [];
  const today = moment().startOf("day"); // Start of today
  const startOfWeek = today.clone().startOf("isoWeek").add(4, "days"); // Get Saturday of the current week

  for (let i = 0; i < 8; i++) {
    const weekEnd = startOfWeek.clone().subtract(i * 7, "days");
    const weekStart = weekEnd.clone().subtract(6, "days");
    weeks.push({
      weekStart: weekStart.format("YYYY-MM-DD"),
      weekEnd: weekEnd.format("YYYY-MM-DD"),
    });
  }

  return weeks.reverse(); // Return in ascending order
}

// Create Commissioned Transaction controller
async function createCommissionedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    const {
      bookedTransactionId,
      commissionedDate,
      commissionedTime,
      remarks,
      createdBy,
    } = req.body;

    if (!Array.isArray(bookedTransactionId)) {
      throw new Error("bookedTransactionId must be an array");
    }

    let clientName;
    let agentName;
    let transactions = {};

    const commissionNumber = await generateCommissionNumber(); // Generate a new commission number

    for (const id of bookedTransactionId) {
      // Creating a new transaction
      await CommissionedTransaction.create(
        {
          bookedTransactionId: id,
          commissionNumber,
          commissionedDate,
          commissionedTime,
          remarks: remarks?.toUpperCase() || "",
          createdBy,
        },
        { transaction }
      );

      const updatedBookedTransaction = await BookedTransaction.findByPk(id, {
        attributes: [
          "id",
          "transactionId",
          "haulingDate",
          "createdBy",
          "statusId",
        ],
        include: [
          {
            model: Client,
            as: "Client",
            attributes: ["clientName", "email"],
            required: false,
            include: {
              model: Commission,
              as: "Commission",
              include: [
                {
                  model: Agent,
                  as: "Agent",
                },
              ],
            },
          },
          {
            model: BilledTransaction,
            as: "BilledTransaction",
            required: false,
            attributes: ["billingNumber"],
          },
        ],
        transaction,
      });

      clientName = updatedBookedTransaction.Client.clientName;
      agentName = `${
        updatedBookedTransaction.Client?.Commission?.[0]?.Agent?.firstName
      } ${updatedBookedTransaction.Client?.Commission?.[0]?.Agent?.lastName} ${
        updatedBookedTransaction.Client?.Commission?.[0]?.Agent?.affix
          ? updatedBookedTransaction.Client?.Commission?.[0]?.Agent?.affix
          : ""
      }`;

      if (!transactions[id]) {
        transactions[id] = {}; // Initialize as an object if not already set
      }

      transactions[id].transactionId = updatedBookedTransaction.transactionId;
      transactions[id].haulingDate = updatedBookedTransaction.haulingDate;
      transactions[id].billingNumber =
        updatedBookedTransaction.BilledTransaction?.[0]?.billingNumber;
      transactions[id].commissionNumber = commissionNumber;
    }

    // Sorting transactions by transactionId
    const sortedTransactions = Object.values(transactions).sort((a, b) => {
      if (a.transactionId < b.transactionId) return -1; // Ascending order
      if (a.transactionId > b.transactionId) return 1;
      return 0;
    });

    // Commit the transaction
    await transaction.commit();

    const emailBody = await CommissionApprovalEmailFormat(
      clientName,
      agentName,
      sortedTransactions
    );
    console.log(emailBody);

    try {
      sendEmail(
        "jmfalar@fareastfuelcorp.com", // Recipient
        // "dcardinez@fareastfuelcorp.com", // Recipient
        `${commissionNumber} - For Commission Statement Approval: ${clientName}`, // Subject
        "Please view this email in HTML format.", // Plain-text fallback
        emailBody
        // ["dm.cardinez@fareastfuel.com"], // HTML content // cc
        // [
        //   "rmangaron@fareastfuelcorp.com",
        //   "edevera@fareastfuelcorp.com",
        //   "eb.devera410@gmail.com",
        //   "cc.duran@fareastfuel.com",
        //   "jmfalar@fareastfuelcorp.com",
        // ] // bcc
      ).catch((emailError) => {
        console.error("Error sending email:", emailError);
      });
    } catch (error) {
      console.error("Unexpected error when sending email:", error);
    }

    res.status(201).json();
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Commissioned Transactions controller
async function getCommissionedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId, null, additionalStatusId);

    const filteredPending = data.pending.filter(
      (item) =>
        item.Client?.Commission?.length > 0 &&
        (!item.CommissionedTransaction ||
          item.CommissionedTransaction.length === 0)
    );
    const filteredInProgress = data.pending.filter(
      (item) =>
        item.Client?.Commission?.length > 0 &&
        item.CommissionedTransaction &&
        item.CommissionedTransaction.length > 0
    );
    const filteredFinished = data.finished.filter(
      (item) => item.Client?.Commission?.length > 0
    );

    res.status(200).json({
      pendingTransactions: filteredPending,
      inProgressTransactions: filteredInProgress,
      finishedTransactions: filteredFinished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Commissioned Transaction controller
async function updateCommissionedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating scheduled transaction with ID:", id);

    let {
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Find the scheduled transaction by UUID (id) and update it
    const updatedCommissionedTransaction =
      await CommissionedTransaction.findByPk(id);

    if (updatedCommissionedTransaction) {
      // Update scheduled transaction attributes
      updatedCommissionedTransaction.bookedTransactionId = bookedTransactionId;
      updatedCommissionedTransaction.logisticsId = logisticsId;
      updatedCommissionedTransaction.scheduledDate = scheduledDate;
      updatedCommissionedTransaction.scheduledTime = scheduledTime;
      updatedCommissionedTransaction.remarks = remarks;
      updatedCommissionedTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedCommissionedTransaction.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId,
        {
          attributes: ["id", "transactionId"],
        }
      );

      // fetch transactions
      const transactionId = updatedBookedTransaction.transactionId;

      const newTransaction = await fetchData(
        statusId,
        null,
        null,
        transactionId
      );

      // Respond with the updated data
      res.status(201).json({
        pendingTransactions: newTransaction.pending,
        inProgressTransactions: newTransaction.inProgress,
        finishedTransactions: newTransaction.finished,
      });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Commissioned Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Commissioned Transaction controller
async function deleteCommissionedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const commissionedTransactionToDelete =
      await CommissionedTransaction.findByPk(id);

    if (commissionedTransactionToDelete) {
      // Update the deletedBy field
      commissionedTransactionToDelete.updatedBy = deletedBy;
      commissionedTransactionToDelete.deletedBy = deletedBy;
      await commissionedTransactionToDelete.save();

      console.log(commissionedTransactionToDelete.bookedTransactionId);

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        commissionedTransactionToDelete.bookedTransactionId
      );
      updatedBookedTransaction.statusId = 1;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await commissionedTransactionToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Commissioned Transaction with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Commissioned Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Commissioned Transactions Dashboard controller
async function getCommissionedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;
    const { selectedEmployee } = req.query;
    const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

    console.log(selectedEmployee);

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Get the last 8 weeks
    const last8Weeks = getLast8Weeks();

    // Initialize an array to hold the grouped transactions
    const formattedCommissionedCounts = [];

    // Iterate over each week
    for (const week of last8Weeks) {
      // Convert weekStart and weekEnd to Date objects
      const startDate = new Date(week.weekStart);
      const endDate = new Date(week.weekEnd);

      // Query the CommissionedTransaction model for transactions within the current week
      const transactions = await CommissionedTransaction.count({
        where: {
          scheduledDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      // Push the transactions into the groupedTransactions array
      formattedCommissionedCounts.push({
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        transactions: transactions,
      });
    }

    // groupedTransactions now contains the transactions grouped by week
    console.log(formattedCommissionedCounts);

    console.log("last8Weeks", last8Weeks);
    console.log("formattedCommissionedCounts", formattedCommissionedCounts);

    const pendingCount = await BookedTransaction.count({
      where: { statusId: 1 },
    });

    const clients = await Client.findAll({
      attributes: ["clientName", "createdBy", "createdAt"],
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["employeeId", "firstName", "lastName"],
        },
      ],
    });

    // Create an array of objects with employee names and client counts
    const clientCountByEmployee = clients.reduce((acc, client) => {
      const { employeeId, firstName, lastName } = client.Employee;
      const employeeName = `${firstName} ${lastName}`;

      // Check if the employee already exists in the accumulator
      if (acc[employeeName]) {
        acc[employeeName].count += 1;
      } else {
        acc[employeeName] = {
          employeeId,
          employeeName,
          count: 1,
        };
      }

      return acc;
    }, {});

    // Convert the accumulator object into an array of objects
    const clientCountByEmployeeData = Object.values(clientCountByEmployee);

    // Check if the selectedEmployee is in clientCountByEmployeeData
    const isEmployeeValid = clientCountByEmployeeData.some(
      (employee) => employee.employeeId === selectedEmployee
    );

    // Build the query to include Employee filter conditionally
    const employeeWhereClause = isEmployeeValid
      ? { employeeId: selectedEmployee } // If selectedEmployee is found in the data, filter by employeeId
      : {}; // If not, no filter for Employee

    const clientsToReturn = await Client.findAll({
      attributes: ["clientName", "createdBy", "createdAt"],
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["employeeId", "firstName", "lastName"],
          where: employeeWhereClause,
        },
      ],
    });

    console.log(isEmployeeValid);
    console.log(employeeWhereClause);

    // Fetch all dispatched transactions between the provided date range
    const commissionedTransactions = await CommissionedTransaction.findAll({
      attributes: ["id", "logisticsId", "scheduledDate", "scheduledTime"],
      where: {
        scheduledDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: BookedTransaction,
          as: "BookedTransaction",
          attributes: ["id", "haulingDate", "haulingTime"],
          required: false,
          include: [
            {
              model: Client,
              as: "Client",
              attributes: ["clientName"],
              include: [
                {
                  model: Employee,
                  as: "Employee",
                  attributes: ["employeeId", "firstName", "lastName"],
                },
              ],
            },
          ],
        },
      ],
    });

    // Initialize counters for on-time and late dispatches
    let onTimeSchedule = 0;
    let lateSchedule = 0;
    const result = {};

    console.log("commissionedTransactions", commissionedTransactions.length);

    // Iterate through dispatched transactions and compare dates and times
    commissionedTransactions.forEach((transaction) => {
      const bookedTransaction = transaction.BookedTransaction;
      const bookedTransactionEmployeeId =
        transaction.BookedTransaction.Client.Employee.employeeId;
      if (bookedTransaction) {
        const haulingDate = new Date(bookedTransaction.haulingDate);
        const haulingTime = bookedTransaction.haulingTime.split(":"); // split time into hours and minutes
        haulingDate.setHours(haulingTime[0], haulingTime[1], 0); // set the time to scheduled time

        const scheduledDate = new Date(transaction.scheduledDate);
        const scheduledTime = transaction.scheduledTime.split(":");
        scheduledDate.setHours(scheduledTime[0], scheduledTime[1], 0); // set the time to dispatched time

        if (isEmployeeValid) {
          if (bookedTransactionEmployeeId === selectedEmployee) {
            // Compare dispatched time and date with scheduled time and date
            if (scheduledDate <= haulingDate) {
              // On time
              onTimeSchedule++;
            } else {
              // Late
              lateSchedule++;
            }
          }
        } else {
          if (scheduledDate <= haulingDate) {
            // On time
            onTimeSchedule++;
          } else {
            // Late
            lateSchedule++;
          }
        }
      }

      if (isEmployeeValid) {
        if (bookedTransactionEmployeeId === selectedEmployee) {
          const clientName =
            transaction.BookedTransaction.Client?.clientName || "";
          const createdBy = transaction.BookedTransaction.Client?.Employee
            ? `${transaction.BookedTransaction.Client.Employee.firstName} ${transaction.BookedTransaction.Client.Employee.lastName}`
            : "";

          // Initialize counts for inhouse and other logistics
          let inHouseLogistics = 0;
          let otherLogistics = 0;
          let total = 0;

          // Check logisticsId of the current transaction (CommissionedTransaction) directly
          if (transaction.logisticsId === matchingLogisticsId) {
            inHouseLogistics++; // Increment for inhouse logistics
            total++;
          } else {
            otherLogistics++; // Increment for other logistics
            total++;
          }

          // Consolidate the result by clientName
          if (result[clientName]) {
            result[clientName].inHouseLogistics += inHouseLogistics;
            result[clientName].otherLogistics += otherLogistics;
            result[clientName].total += total;
          } else {
            result[clientName] = {
              id: clientName,
              clientName,
              inHouseLogistics,
              otherLogistics,
              total,
              createdBy,
            };
          }
        }
      } else {
        const clientName =
          transaction.BookedTransaction.Client?.clientName || "";
        const createdBy = transaction.BookedTransaction.Client?.Employee
          ? `${transaction.BookedTransaction.Client.Employee.firstName} ${transaction.BookedTransaction.Client.Employee.lastName}`
          : "";

        // Initialize counts for inhouse and other logistics
        let inHouseLogistics = 0;
        let otherLogistics = 0;
        let total = 0;

        // Check logisticsId of the current transaction (CommissionedTransaction) directly
        if (transaction.logisticsId === matchingLogisticsId) {
          inHouseLogistics++; // Increment for inhouse logistics
          total++;
        } else {
          otherLogistics++; // Increment for other logistics
          total++;
        }

        // Consolidate the result by clientName
        if (result[clientName]) {
          result[clientName].inHouseLogistics += inHouseLogistics;
          result[clientName].otherLogistics += otherLogistics;
          result[clientName].total += total;
        } else {
          result[clientName] = {
            id: clientName,
            clientName,
            inHouseLogistics,
            otherLogistics,
            total,
            createdBy,
          };
        }
      }
    });

    const totalSchedule = onTimeSchedule + lateSchedule;
    const onTimePercentage =
      totalSchedule > 0
        ? ((onTimeSchedule / totalSchedule) * 100).toFixed(2)
        : "0.00";

    const pending = pendingCount;
    const totalClients = clientsToReturn.length;
    const resultArray = Object.values(result);

    const filteredResultArray = resultArray.filter((item) => item.id !== "");

    // Respond with the updated data
    res.status(200).json({
      pending,
      totalSchedule,
      onTimeSchedule,
      onTimePercentage,
      lateSchedule,
      commissionedTransactions,
      totalClients,
      clientCountByEmployeeData,
      result: filteredResultArray,
      commissionedTransactionCounts: formattedCommissionedCounts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createCommissionedTransactionController,
  getCommissionedTransactionsController,
  updateCommissionedTransactionController,
  deleteCommissionedTransactionController,
  getCommissionedTransactionsDashboardController,
};
