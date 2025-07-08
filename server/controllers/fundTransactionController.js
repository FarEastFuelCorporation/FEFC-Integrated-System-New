// controllers/fundTransactionController.js

const FundTransaction = require("../models/FundTransaction");
const generateFundTransactionNumber = require("../utils/generateFundTransactionNumber");

const fundLabels = [
  { label: "TRUCKING FUND", value: "truckingFund" },
  { label: "DIESEL FUND", value: "dieselFund" },
  { label: "GASOLINE FUND", value: "gasolineFund" },
  { label: "SCRAP SALES", value: "scrapSales" },
  { label: "TRUCK SCALE COLLECTION", value: "truckScaleCollection" },
  { label: "HOUSE COLLECTION", value: "houseCollection" },
  { label: "PURCHASE REQUEST FUND", value: "purchaseRequestFund" },
  { label: "PURCHASE REQUEST PAYABLE", value: "purchaseRequestPayable" },
  { label: "SIR RUEL'S FUND", value: "sirRuelFund" },
];

// Create label → value mapping
const labelToValue = fundLabels.reduce((acc, { label, value }) => {
  acc[label] = value;
  return acc;
}, {});

// Create Fund Transaction controller
async function createFundTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      transactionDate,
      fundSource,
      fundAllocation,
      amount,
      remarks,
      createdBy,
    } = req.body;

    const transactionNumber = await generateFundTransactionNumber();

    // Creating a new fund transaction
    const newEntry = await FundTransaction.create({
      transactionNumber,
      transactionDate,
      fundSource,
      fundAllocation,
      amount,
      remarks: remarks ? remarks.toUpperCase() : "",
      createdBy,
    });

    const fundTransaction = await FundTransaction.findByPk(newEntry.id);

    // Respond with the updated fund transaction data
    res.status(201).json({ fundTransaction });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Fund Transactions controller
async function getFundTransactionsController(req, res) {
  try {
    // Fetch all fundTransactions from the database
    const fundTransactions = await FundTransaction.findAll({
      order: [["transactionDate", "DESC"]],
    });

    const funds = {
      truckingFund: 0,
      dieselFund: 0,
      gasolineFund: 0,
      scrapSales: 0,
      truckScaleCollection: 0,
      houseCollection: 0,
      purchaseRequestFund: 0,
      purchaseRequestPayable: 0,
      sirRuelFund: 0,
    };

    for (const transaction of fundTransactions) {
      const { fundSource, fundAllocation, amount } = transaction;

      const sourceKey = labelToValue[fundSource];
      const allocationKey = labelToValue[fundAllocation];

      if (sourceKey && funds.hasOwnProperty(sourceKey)) {
        funds[sourceKey] -= amount;
      }

      if (allocationKey && funds.hasOwnProperty(allocationKey)) {
        funds[allocationKey] += amount;
      }
    }

    res.json({ fundTransactions, funds });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Fund Transaction controller
async function updateFundTransactionController(req, res) {
  try {
    const id = req.params.id;

    // Destructure fields from request body
    let {
      transactionDate,
      fundSource,
      fundAllocation,
      amount,
      remarks,
      createdBy,
    } = req.body;

    remarks = remarks ? remarks.toUpperCase() : "";

    // Find the existing transaction
    const fundTransaction = await FundTransaction.findByPk(id);

    if (!fundTransaction) {
      return res
        .status(404)
        .json({ message: `Fund transaction with ID ${id} not found.` });
    }

    // Capture old amount before update
    const oldAmount = parseFloat(fundTransaction.amount);
    const newAmount = parseFloat(amount);
    const amountDifference = newAmount - oldAmount;

    // Update fields
    fundTransaction.transactionDate = transactionDate;
    fundTransaction.fundSource = fundSource;
    fundTransaction.fundAllocation = fundAllocation;
    fundTransaction.amount = newAmount;
    fundTransaction.remarks = remarks;
    fundTransaction.updatedBy = createdBy;

    // Save the updated transaction
    await fundTransaction.save();

    res.json({
      fundTransaction,
      amountDifference, // e.g. +1000, -500, etc.
    });
  } catch (error) {
    console.error("Error updating fund transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Fund Transaction controller
async function deleteFundTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting FundTransaction with ID:", id);

    // Find the FundTransaction by ID
    const fundTransactionToDelete = await FundTransaction.findByPk(id);

    if (!fundTransactionToDelete) {
      return res
        .status(404)
        .json({ message: `FundTransaction with ID ${id} not found` });
    }

    // Capture details before deletion
    const fundSource = fundTransactionToDelete.fundSource;
    const fundAllocation = fundTransactionToDelete.fundAllocation;
    const amount = fundTransactionToDelete.amount;

    // Update deletedBy fields
    fundTransactionToDelete.updatedBy = deletedBy;
    fundTransactionToDelete.deletedBy = deletedBy;

    // Save the updates
    await fundTransactionToDelete.save();

    // Perform soft delete (paranoid mode)
    await fundTransactionToDelete.destroy();

    // Respond with useful data for frontend to adjust funds
    res.json({
      message: `FundTransaction with ID ${id} soft-deleted successfully`,
      fundSource,
      fundAllocation,
      amount,
    });
  } catch (error) {
    console.error("Error soft-deleting FundTransaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getFundTransactionsController,
  createFundTransactionController,
  updateFundTransactionController,
  deleteFundTransactionController,
};
