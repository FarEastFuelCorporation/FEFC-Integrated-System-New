// controllers/warehousedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const WarehousedTransaction = require("../models/WarehousedTransaction");
const WarehousedTransactionItem = require("../models/WarehousedTransactionItem");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 4;

// Create Warehoused Transaction controller
async function createWarehousedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      receivedTransactionId,
      warehousedDate,
      warehousedTime,
      warehousedItems,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    // Creating a new sorted transaction
    const newWarehousedTransaction = await WarehousedTransaction.create(
      {
        receivedTransactionId,
        warehousedDate,
        warehousedTime,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );

    console.log(warehousedItems);

    // Adding warehousedItems to WarehousedTransactionItem table
    if (warehousedItems && warehousedItems.length > 0) {
      const warehousedItemsPromises = warehousedItems.map((item) => {
        let description = item.description;

        description = description && description.toUpperCase();

        return WarehousedTransactionItem.create(
          {
            warehousedTransactionId: newWarehousedTransaction.id,
            gatePass: item.gatePass,
            warehouse: item.warehouse,
            area: item.area,
            section: item.section,
            level: item.level,
            palletNumber: item.palletNumber,
            steamNumber: item.steamNumber,
            quantity: item.quantity,
            unit: item.unit,
            description: item.description,
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
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // Commit the transaction
      await transaction.commit();

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

// Get Warehoused Transactions controller
async function getWarehousedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId);

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

// Update Warehoused Transaction controller
async function updateWarehousedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    console.log("Updating Warehoused transaction with ID:", id);

    let {
      receivedTransactionId,
      warehousedDate,
      warehousedTime,
      warehousedItems,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the sorted transaction by ID and update it
    const updatedWarehousedTransaction = await WarehousedTransaction.findByPk(
      id
    );

    if (updatedWarehousedTransaction) {
      // Update sorted transaction attributes
      updatedWarehousedTransaction.receivedTransactionId =
        receivedTransactionId;
      updatedWarehousedTransaction.warehousedDate = warehousedDate;
      updatedWarehousedTransaction.warehousedTime = warehousedTime;
      updatedWarehousedTransaction.remarks = remarks;
      updatedWarehousedTransaction.updatedBy = createdBy;

      // Save the updated sorted transaction
      await updatedWarehousedTransaction.save({ transaction });

      // Fetch existing sorted items and scraps from the database
      const existingWarehousedTransactionItems =
        await WarehousedTransactionItem.findAll({
          where: { warehousedTransactionId: id },
          transaction,
        });

      // Extract existing sorted item and scrap IDs
      const existingItemIds = existingWarehousedTransactionItems.map(
        (item) => item.id
      );

      // Extract updated sorted item and scrap IDs from the request body
      const updatedItemIds = warehousedItems.map((item) => item.id);

      // Identify items and scraps to delete (those not present in the updated data)
      const itemsToDelete = existingWarehousedTransactionItems.filter(
        (item) => !updatedItemIds.includes(item.id)
      );

      // Identify items and scraps to update and create
      const warehousedItemPromises = warehousedItems.map(async (item) => {
        if (item.id && existingItemIds.includes(item.id)) {
          // Update existing item
          await WarehousedTransactionItem.update(
            {
              description: item.description && item.description.toUpperCase(),
              gatePass: item.gatePass,
              warehouse: item.warehouse,
              area: item.area,
              section: item.section,
              level: item.level,
              palletNumber: item.palletNumber,
              steamNumber: item.steamNumber,
              quantity: item.quantity,
              unit: item.unit,
            },
            { where: { id: item.id }, transaction }
          );
        } else {
          // Create new item
          await WarehousedTransactionItem.create(
            {
              warehousedTransactionId: id,
              description: item.description && item.description.toUpperCase(),
              gatePass: item.gatePass,
              warehouse: item.warehouse,
              area: item.area,
              section: item.section,
              level: item.level,
              palletNumber: item.palletNumber,
              steamNumber: item.steamNumber,
              quantity: item.quantity,
              unit: item.unit,
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
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Warehoused Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating sorted transaction:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Warehoused Transaction controller
async function deleteWarehousedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the sorted transaction by UUID (id)
    const warehousedTransactionToDelete = await WarehousedTransaction.findByPk(
      id
    );

    if (warehousedTransactionToDelete) {
      // Update the deletedBy field
      warehousedTransactionToDelete.updatedBy = deletedBy;
      warehousedTransactionToDelete.deletedBy = deletedBy;
      await warehousedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = statusId;

      await updatedBookedTransaction.save();

      // Soft delete the sorted transaction (sets deletedAt timestamp)
      await warehousedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Warehoused Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting sorted transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createWarehousedTransactionController,
  getWarehousedTransactionsController,
  updateWarehousedTransactionController,
  deleteWarehousedTransactionController,
};
