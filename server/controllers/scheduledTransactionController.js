// controllers/scheduledTransactionController.js

const { Op, fn, col, literal } = require("sequelize");
const moment = require("moment"); // Ensure you have moment.js installed
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const Vehicle = require("../models/Vehicle");
const QuotationTransportation = require("../models/QuotationTransportation");
const VehicleType = require("../models/VehicleType");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const {
  ScheduleTransactionEmailFormat,
  ScheduleTransactionEmailToLogisticsFormat,
} = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");
const QuotationWaste = require("../models/QuotationWaste");
const statusId = 1;

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

// Create Scheduled Transaction controller
async function createScheduledTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Creating a new transaction
    const scheduledTransaction = await ScheduledTransaction.create({
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      createdBy,
    });

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      {
        attributes: [
          "id",
          "transactionId",
          "quotationWasteId",
          "quotationTransportationId",
          "statusId",
          "createdBy",
        ],
        include: {
          model: Client,
          as: "Client",
          attributes: ["clientName", "email"],
        },
      }
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // fetch transactions
      const transactionId = updatedBookedTransaction.transactionId;

      const newTransaction = await fetchData(
        statusId,
        null,
        null,
        transactionId
      );

      const quotationWaste = await QuotationWaste.findByPk(
        updatedBookedTransaction.quotationWasteId,
        {
          attributes: ["wasteName"],
        }
      );

      const quotationTransportation = await QuotationTransportation.findByPk(
        updatedBookedTransaction.quotationTransportationId,
        {
          attributes: ["vehicleTypeId"],
          include: {
            model: VehicleType,
            as: "VehicleType",
            attributes: ["typeOfVehicle"],
          },
        }
      );

      const scheduledTransactionData = await ScheduledTransaction.findByPk(
        scheduledTransaction.id,
        {
          attributes: ["createdBy"],
          include: {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        }
      );

      const wasteName = quotationWaste ? quotationWaste.wasteName : "";
      const typeOfVehicle =
        quotationTransportation?.VehicleType?.typeOfVehicle || "CLIENT VEHICLE";
      const clientName = updatedBookedTransaction?.Client?.clientName || "";
      const clientId = updatedBookedTransaction?.createdBy || "";
      const clientType = clientId?.slice(0, 3) || "";
      const clientEmail = updatedBookedTransaction?.Client?.email || "";
      const scheduledBy = `${scheduledTransactionData.Employee.firstName} ${scheduledTransactionData.Employee.lastName}`;

      const emailBody = await ScheduleTransactionEmailFormat(
        clientType,
        clientName,
        transactionId,
        scheduledDate,
        scheduledTime,
        wasteName,
        typeOfVehicle,
        remarks,
        scheduledBy
      );

      try {
        sendEmail(
          clientEmail, // Recipient
          `${transactionId} - Scheduled Transaction: ${clientName}`, // Subject
          "Please view this email in HTML format.", // Plain-text fallback
          emailBody, // HTML content
          ["marketing@fareastfuelcorp.com"], // cc
          [
            "rmangaron@fareastfuelcorp.com",
            "edevera@fareastfuelcorp.com",
            "eb.devera410@gmail.com",
            "cc.duran@fareastfuel.com",
            "dcardinez@fareastfuelcorp.com",
            "dm.cardinez@fareastfuel.com",
            "je.soriano@fareastfuel.com",
          ] // bcc
        ).catch((emailError) => {
          console.error("Error sending email:", emailError);
        });
      } catch (error) {
        console.error("Unexpected error when sending email:", error);
      }

      if (logisticsId === "0577d985-8f6f-47c7-be3c-20ca86021154") {
        console.log("pass");
        const emailBody2 = await ScheduleTransactionEmailToLogisticsFormat(
          clientType,
          clientName,
          transactionId,
          scheduledDate,
          scheduledTime,
          wasteName,
          typeOfVehicle,
          remarks,
          scheduledBy
        );

        try {
          sendEmail(
            "logistics@fareastfuelcorp.com", // Recipient
            `${transactionId} - Scheduled Transaction: ${clientName}`, // Subject
            "Please view this email in HTML format.", // Plain-text fallback
            emailBody2, // HTML content
            ["marketing@fareastfuelcorp.com"], // cc
            [
              "rmangaron@fareastfuelcorp.com",
              "edevera@fareastfuelcorp.com",
              "eb.devera410@gmail.com",
              "cc.duran@fareastfuel.com",
              "dcardinez@fareastfuelcorp.com",
              "dm.cardinez@fareastfuel.com",
            ] // bcc
          ).catch((emailError) => {
            console.error("Error sending email:", emailError);
          });
        } catch (error) {
          console.error("Unexpected error when sending email:", error);
        }
      }

      // Respond with the updated data
      res.status(201).json({
        pendingTransactions: newTransaction.pending,
        inProgressTransactions: newTransaction.inProgress,
        finishedTransactions: newTransaction.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Scheduled Transactions controller
async function getScheduledTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId);

    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Scheduled Transaction controller
async function updateScheduledTransactionController(req, res) {
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
    const updatedScheduledTransaction = await ScheduledTransaction.findByPk(id);

    if (updatedScheduledTransaction) {
      // Update scheduled transaction attributes
      updatedScheduledTransaction.bookedTransactionId = bookedTransactionId;
      updatedScheduledTransaction.logisticsId = logisticsId;
      updatedScheduledTransaction.scheduledDate = scheduledDate;
      updatedScheduledTransaction.scheduledTime = scheduledTime;
      updatedScheduledTransaction.remarks = remarks;
      updatedScheduledTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedScheduledTransaction.save();

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
        .json({ message: `Scheduled Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Scheduled Transaction controller
async function deleteScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const scheduledTransactionToDelete = await ScheduledTransaction.findByPk(
      id
    );

    if (scheduledTransactionToDelete) {
      // Update the deletedBy field
      scheduledTransactionToDelete.updatedBy = deletedBy;
      scheduledTransactionToDelete.deletedBy = deletedBy;
      await scheduledTransactionToDelete.save();

      console.log(scheduledTransactionToDelete.bookedTransactionId);

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        scheduledTransactionToDelete.bookedTransactionId
      );
      updatedBookedTransaction.statusId = 1;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await scheduledTransactionToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Scheduled Transaction with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Scheduled Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Scheduled Transactions Dashboard controller
async function getScheduledTransactionsDashboardController(req, res) {
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
    const formattedScheduledCounts = [];

    // Iterate over each week
    for (const week of last8Weeks) {
      // Convert weekStart and weekEnd to Date objects
      const startDate = new Date(week.weekStart);
      const endDate = new Date(week.weekEnd);

      // Query the ScheduledTransaction model for transactions within the current week
      const transactions = await ScheduledTransaction.count({
        where: {
          scheduledDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      // Push the transactions into the groupedTransactions array
      formattedScheduledCounts.push({
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        transactions: transactions,
      });
    }

    // groupedTransactions now contains the transactions grouped by week
    console.log(formattedScheduledCounts);

    console.log("last8Weeks", last8Weeks);
    console.log("formattedScheduledCounts", formattedScheduledCounts);

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
    const scheduledTransactions = await ScheduledTransaction.findAll({
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

    console.log("scheduledTransactions", scheduledTransactions.length);

    // Iterate through dispatched transactions and compare dates and times
    scheduledTransactions.forEach((transaction) => {
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

          // Check logisticsId of the current transaction (ScheduledTransaction) directly
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

        // Check logisticsId of the current transaction (ScheduledTransaction) directly
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
      scheduledTransactions,
      totalClients,
      clientCountByEmployeeData,
      result: filteredResultArray,
      scheduledTransactionCounts: formattedScheduledCounts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
  getScheduledTransactionsDashboardController,
};
