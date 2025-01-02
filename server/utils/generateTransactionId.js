// utils/generateTransactionId

const { Op } = require("sequelize");
const BookedTransaction = require("../models/BookedTransaction");

async function generateTransactionId(haulingDate) {
  try {
    // Get the year from the haulingDate
    const haulingYear = new Date(haulingDate).getFullYear().toString();

    // Find the latest transaction ID for the given year
    const latestTransaction = await BookedTransaction.findOne({
      where: {
        transactionId: {
          [Op.like]: `${haulingYear}%`, // Match IDs starting with the hauling year
        },
      },
      order: [["transactionId", "DESC"]], // Order by transactionId in descending order
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.transactionId;
      const latestIdNumber = parseInt(latestTransactionId.substring(4), 10);
      newIdNumber = latestIdNumber + 1;
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(4, "0");
    const newTransactionId = `${haulingYear}${newIdString}`;

    return newTransactionId;
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    throw error;
  }
}

module.exports = generateTransactionId;
