// utils/generateCommissionNumber

const CommissionedTransaction = require("../models/CommissionedTransaction");

async function generateCommissionNumber() {
  try {
    // Get the current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Ensure month is 2 digits (e.g., '09')

    // Find the latest transaction ID with the specified prefix
    const latestTransaction = await CommissionedTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction?.commissionNumber) {
      const latestTransactionId = latestTransaction.commissionNumber;

      // Extract parts correctly
      const latestYear = latestTransactionId.substring(3, 5); // Should get "25"
      const latestMonth = latestTransactionId.substring(6, 8); // Should get "07"

      if (latestYear === currentYear && latestMonth === currentMonth) {
        const latestIdNumber = parseInt(latestTransactionId.substring(9), 10); // Should get "001"
        newIdNumber = latestIdNumber + 1;
      }
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(3, "0");
    const newTransactionId = `CSN${currentYear}-${currentMonth}-${newIdString}`; // Format as BYY-MM-XXX

    return newTransactionId;
  } catch (error) {
    console.error("Error generating billing number:", error);
    throw error;
  }
}

module.exports = generateCommissionNumber;
