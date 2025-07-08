// utils/generateFundTransactionNumber
const FundTransaction = require("../models/FundTransaction");

async function generateFundTransactionNumber() {
  try {
    const currentYear = new Date().getFullYear().toString(); // e.g., '2025'

    // Find the latest transaction including soft-deleted, sorted by createdAt descending
    const latestTransaction = await FundTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false,
    });

    let newIdNumber = 1;

    if (latestTransaction) {
      const latestTransactionNumber = latestTransaction.transactionNumber; // e.g., 'FT202500023'
      const latestYear = latestTransactionNumber.substring(2, 6); // '2025'
      const latestSequence = parseInt(latestTransactionNumber.substring(6), 10); // '00023'

      if (latestYear === currentYear) {
        newIdNumber = latestSequence + 1;
      }
    }

    const newSequence = newIdNumber.toString().padStart(5, "0"); // '00001'
    const newTransactionNumber = `FT${currentYear}${newSequence}`; // 'FT202500001'

    return newTransactionNumber;
  } catch (error) {
    console.error("Error generating fund transaction number:", error);
    throw error;
  }
}

module.exports = generateFundTransactionNumber;
