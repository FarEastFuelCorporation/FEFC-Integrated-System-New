// controllers/scheduledTransactionController.js

const { Op } = require("sequelize");
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
const statusId = 1;

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
    await ScheduledTransaction.create({
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
        attributes: ["id", "transactionId", "statusId"],
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

// Get Dispatched Transactions Dashboard controller
async function getScheduledTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;
    const { selectedEmployee } = req.query;
    const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

    console.log(selectedEmployee);

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

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
