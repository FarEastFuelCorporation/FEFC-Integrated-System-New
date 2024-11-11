// controllers/receivedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 2;
const additionalStatusId = 3;

// Create Received Transaction controller
async function createReceivedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Creating a new transaction
    await ReceivedTransaction.create({
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
      remarks,
      createdBy,
    });

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
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

// Get Received Transactions controller
async function getReceivedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId, null, additionalStatusId);

    console.log(data);

    // Respond with the updated data
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

// Update Received Transaction controller
async function updateReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Received transaction with ID:", id);

    let {
      receivedDate,
      receivedTime,
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
      remarks,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Find the booked transaction by UUID (id) and update it
    const updatedReceivedTransaction = await ReceivedTransaction.findByPk(id);

    if (updatedReceivedTransaction) {
      // Update booked transaction attributes
      updatedReceivedTransaction.receivedDate = receivedDate;
      updatedReceivedTransaction.receivedTime = receivedTime;
      updatedReceivedTransaction.vehicle = vehicle;
      updatedReceivedTransaction.driver = driver;
      updatedReceivedTransaction.pttNo = pttNo;
      updatedReceivedTransaction.manifestNo = manifestNo;
      updatedReceivedTransaction.pullOutFormNo = pullOutFormNo;
      updatedReceivedTransaction.truckScaleNo = truckScaleNo;
      updatedReceivedTransaction.manifestWeight = manifestWeight;
      updatedReceivedTransaction.clientWeight = clientWeight;
      updatedReceivedTransaction.grossWeight = grossWeight;
      updatedReceivedTransaction.tareWeight = tareWeight;
      updatedReceivedTransaction.netWeight = netWeight;
      updatedReceivedTransaction.submitTo = submitTo;
      updatedReceivedTransaction.remarks = remarks;
      updatedReceivedTransaction.updatedBy = createdBy;

      // Save the updated received transaction
      await updatedReceivedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If received transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Received Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating received transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Received Transaction controller
async function deleteReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const receivedTransactionToDelete = await ReceivedTransaction.findByPk(id);

    if (receivedTransactionToDelete) {
      // Update the deletedBy field
      receivedTransactionToDelete.updatedBy = deletedBy;
      receivedTransactionToDelete.deletedBy = deletedBy;
      await receivedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 3;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await receivedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
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
async function getReceivedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;
    const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const scheduledTransactionsNoDispatchCount =
      await ScheduledTransaction.count({
        where: {
          logisticsId: matchingLogisticsId,
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            required: false, // LEFT JOIN
            where: {
              id: null, // Ensure no matching DispatchedTransaction
              deletedAt: null, // Exclude rows where DispatchedTransaction is soft deleted
            },
          },
        ],
      });

    const scheduledTransactionsWithDispatchCount =
      await ScheduledTransaction.count({
        where: {
          logisticsId: matchingLogisticsId,
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            required: true, // INNER JOIN (only include rows with matching DispatchedTransaction)
            where: {
              id: { [Op.ne]: null }, // Ensure there is a matching DispatchedTransaction
              deletedAt: null, // Exclude soft-deleted DispatchedTransaction
            },
          },
        ],
      });

    // Fetch all dispatched transactions between the provided date range
    const dispatchedTransactions = await DispatchedTransaction.findAll({
      attributes: ["id", "dispatchedDate", "dispatchedTime"],
      where: {
        dispatchedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: ReceivedTransaction,
          as: "ReceivedTransaction",
          attributes: ["id"],
          required: false,
        },
        {
          model: Vehicle,
          as: "Vehicle",
          attributes: ["plateNumber"],
        },
        {
          model: ScheduledTransaction,
          as: "ScheduledTransaction",
          attributes: ["scheduledDate", "scheduledTime"],
          required: false,
          include: {
            model: BookedTransaction,
            as: "BookedTransaction",
            attributes: ["id"],
            required: false,
            include: [
              {
                model: QuotationTransportation,
                as: "QuotationTransportation",
                required: false,
                attributes: ["unitPrice"],
                include: [
                  {
                    model: VehicleType,
                    as: "VehicleType",
                    attributes: ["typeOfVehicle"],
                  },
                ],
              },
              {
                model: Client,
                as: "Client",
                attributes: ["clientName"],
              },
            ],
          },
        },
      ],
    });

    // Initialize counters for on-time and late dispatches
    let ontimeDispatch = 0;
    let lateDispatch = 0;

    // Initialize variable for income calculation
    let income = 0;

    // Create an object to store the count of trips per client
    const clientTrips = {};
    const vehicleTrips = {};
    const vehicleTypeTrips = {};

    // Iterate through dispatched transactions and compare dates and times
    dispatchedTransactions.forEach((transaction) => {
      const scheduledTransaction = transaction.ScheduledTransaction;
      if (scheduledTransaction) {
        const scheduledDate = new Date(scheduledTransaction.scheduledDate);
        const scheduledTime = scheduledTransaction.scheduledTime.split(":"); // split time into hours and minutes
        scheduledDate.setHours(scheduledTime[0], scheduledTime[1], 0); // set the time to scheduled time

        const dispatchedDate = new Date(transaction.dispatchedDate);
        const dispatchedTime = transaction.dispatchedTime.split(":");
        dispatchedDate.setHours(dispatchedTime[0], dispatchedTime[1], 0); // set the time to dispatched time

        // Compare dispatched time and date with scheduled time and date
        if (dispatchedDate <= scheduledDate) {
          // On time
          ontimeDispatch++;
        } else {
          // Late
          lateDispatch++;
        }

        // Calculate the total income from QuotationTransportation's unitPrice
        if (scheduledTransaction?.BookedTransaction) {
          // Directly access the QuotationTransportation since BookedTransaction is an object
          const bookedTransaction = scheduledTransaction.BookedTransaction;
          const quotationTransportation =
            bookedTransaction?.QuotationTransportation;

          if (
            quotationTransportation &&
            typeof quotationTransportation.unitPrice === "number"
          ) {
            income += quotationTransportation.unitPrice || 0;
          }
        }
      }
      const client =
        transaction.ScheduledTransaction?.BookedTransaction?.Client;
      const vehicle = transaction.Vehicle;
      const quotationTransportation =
        transaction.ScheduledTransaction?.BookedTransaction
          ?.QuotationTransportation;
      const unitPrice = quotationTransportation
        ? quotationTransportation.unitPrice
        : 0; // Default to 0 if unitPrice is not available
      const vehicleType = quotationTransportation?.VehicleType;

      if (client) {
        const { id, clientName } = client; // Use clientName from the Client model

        if (clientTrips[clientName]) {
          clientTrips[clientName].count += 1;
          clientTrips[clientName].totalIncome += unitPrice; // Add unitPrice to totalIncome for the client
        } else {
          clientTrips[clientName] = {
            id: clientName,
            header: clientName,
            count: 1,
            totalIncome: unitPrice, // Initialize totalIncome with the unitPrice
          };
        }
      }
      if (vehicle) {
        const { plateNumber } = vehicle; // Use plateNumber from the Vehicle model
        if (vehicleTrips[plateNumber]) {
          vehicleTrips[plateNumber].count += 1;
          vehicleTrips[plateNumber].totalIncome += unitPrice; // Add unitPrice to totalIncome for the vehicle
        } else {
          vehicleTrips[plateNumber] = {
            id: plateNumber,
            header: plateNumber,
            count: 1,
            totalIncome: unitPrice, // Initialize totalIncome with the unitPrice
          };
        }
      }
      // Process vehicle type trips and income
      if (vehicleType) {
        const { typeOfVehicle } = vehicleType;
        if (vehicleTypeTrips[typeOfVehicle]) {
          vehicleTypeTrips[typeOfVehicle].count += 1;
          vehicleTypeTrips[typeOfVehicle].totalIncome += unitPrice; // Add unitPrice to totalIncome for the vehicle type
        } else {
          vehicleTypeTrips[typeOfVehicle] = {
            id: typeOfVehicle,
            header: typeOfVehicle,
            count: 1,
            totalIncome: unitPrice, // Initialize totalIncome with the unitPrice
          };
        }
      }
    });

    // Convert clientTrips object to an array of { id, clientName, count }
    const clientTripsArray = Object.values(clientTrips);
    const vehicleTripsArray = Object.values(vehicleTrips);
    const vehicleTypeTripsArray = Object.values(vehicleTypeTrips);

    const totalDispatch = dispatchedTransactions.length;
    const onTimePercentage =
      totalDispatch > 0
        ? ((ontimeDispatch / totalDispatch) * 100).toFixed(2)
        : "0.00";
    const pending =
      scheduledTransactionsNoDispatchCount -
      scheduledTransactionsWithDispatchCount;

    // Respond with the updated data
    res.status(200).json({
      pending,
      totalDispatch,
      ontimeDispatch,
      onTimePercentage,
      lateDispatch,
      income,
      dispatchedTransactions,
      clientTripsArray,
      vehicleTripsArray,
      vehicleTypeTripsArray,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createReceivedTransactionController,
  getReceivedTransactionsController,
  updateReceivedTransactionController,
  deleteReceivedTransactionController,
  getReceivedTransactionsDashboardController,
};
