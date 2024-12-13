// controllers/warehousedOutTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const WarehousedOutTransaction = require("../models/WarehousedOutTransaction");
const WarehousedOutTransactionItem = require("../models/WarehousedOutTransactionItem");
const WarehousedTransaction = require("../models/WarehousedTransaction");
const WarehousedTransactionItem = require("../models/WarehousedTransactionItem");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 6;

// Create Warehoused Out Transaction controller
async function createWarehousedOutTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      warehousedTransactionId,
      warehousedOutDate,
      warehousedOutTime,
      warehousedOutItems,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    let isDone =
      warehousedOutItems.length > 0 &&
      warehousedOutItems.every((item) => Number(item.remaining) === 0);

    console.log(warehousedOutItems);
    console.log(isDone);

    // Creating a new warehoused out transaction
    const newWarehousedTransaction = await WarehousedOutTransaction.create(
      {
        warehousedTransactionId,
        warehousedOutDate,
        warehousedOutTime,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );

    console.log(warehousedOutItems);

    // Adding warehousedItems to WarehousedTransactionItem table
    if (warehousedOutItems && warehousedOutItems.length > 0) {
      const warehousedItemsPromises = warehousedOutItems
        .filter((item) => item.quantityOut > 0)
        .map((item) => {
          console.log("item.quantityOut", item.quantityOut);
          return WarehousedOutTransactionItem.create(
            {
              warehousedOutTransactionId: newWarehousedTransaction.id,
              warehousedTransactionItemId: item.warehousedTransactionItemId,
              quantity: item.quantityOut,
            },
            { transaction: transaction }
          );
        });

      await Promise.all(warehousedItemsPromises);
    }

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = isDone
        ? statusId
        : transactionStatusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

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

// Get Warehoused Out Transactions controller
async function getWarehousedOutTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId);

    console.log("statusId", transactionStatusId);

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

// Update Warehoused Out Transaction controller
async function updateWarehousedOutTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    console.log("Updating Warehoused transaction with ID:", id);

    let {
      bookedTransactionId,
      warehousedTransactionId,
      warehousedOutDate,
      warehousedOutTime,
      warehousedOutItems,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the warehoused out transaction by ID and update it
    const updatedWarehousedOutTransaction =
      await WarehousedOutTransaction.findByPk(id);

    if (updatedWarehousedOutTransaction) {
      // Update warehoused out transaction attributes
      updatedWarehousedOutTransaction.warehousedTransactionId =
        warehousedTransactionId;
      updatedWarehousedOutTransaction.warehousedOutDate = warehousedOutDate;
      updatedWarehousedOutTransaction.warehousedOutTime = warehousedOutTime;
      updatedWarehousedOutTransaction.remarks = remarks;
      updatedWarehousedOutTransaction.updatedBy = createdBy;

      // Save the updated warehoused out transaction
      await updatedWarehousedOutTransaction.save({ transaction });

      // Fetch existing warehoused out items and scraps from the database
      const existingWarehousedOutTransactionItems =
        await WarehousedOutTransactionItem.findAll({
          where: { warehousedOutTransactionId: id },
          transaction,
        });

      // Extract existing warehoused out item and scrap IDs
      const existingItemIds = existingWarehousedOutTransactionItems.map(
        (item) => item.id
      );

      // Extract updated warehoused out item and scrap IDs from the request body
      const updatedItemIds = warehousedOutItems.map((item) => item.id);

      // Identify items and scraps to delete (those not present in the updated data)
      const itemsToDelete = existingWarehousedOutTransactionItems.filter(
        (item) => !updatedItemIds.includes(item.id)
      );

      // Identify items and scraps to update and create
      const warehousedItemPromises = warehousedOutItems.map(async (item) => {
        if (item.id && existingItemIds.includes(item.id)) {
          // Update existing item
          await WarehousedOutTransactionItem.update(
            {
              quantity: item.quantity,
            },
            { where: { id: item.id }, transaction }
          );
        } else {
          // Create new item
          await WarehousedTransactionItem.create(
            {
              warehousedTransactionId: id,
              warehousedTransactionItemId: item.warehousedTransactionItemId,
              quantity: item.quantity,
            },
            { transaction }
          );
        }
      });

      // Delete items and scraps that are no longer present
      const deleteWastePromises = itemsToDelete.map((item) =>
        WarehousedTransactionItem.destroy({
          where: { id: item.id },
          transaction,
        })
      );

      // Wait for all promises to resolve
      await Promise.all([...warehousedItemPromises, ...deleteWastePromises]);

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If warehoused out transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Warehoused Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating warehoused out transaction:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Warehoused Out Transaction controller
async function deleteWarehousedOutTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log("id", id);
    console.log("bookedTransactionId", bookedTransactionId);

    console.log("Soft deleting warehoused out transaction with ID:", id);

    // Find the warehoused out transaction by UUID (id)
    const warehousedTransactionToDelete =
      await WarehousedOutTransactionItem.findByPk(id);

    if (warehousedTransactionToDelete) {
      // Update the deletedBy field
      warehousedTransactionToDelete.updatedBy = deletedBy;
      warehousedTransactionToDelete.deletedBy = deletedBy;
      await warehousedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = transactionStatusId;

      await updatedBookedTransaction.save();

      // Soft delete the warehoused out transaction (sets deletedAt timestamp)
      await warehousedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If warehoused out transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Warehoused Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting warehoused out transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createWarehousedOutTransactionController,
  getWarehousedOutTransactionsController,
  updateWarehousedOutTransactionController,
  deleteWarehousedOutTransactionController,
};
