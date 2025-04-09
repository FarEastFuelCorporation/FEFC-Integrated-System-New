// utils/generateBatchId

const ProductionJD = require("../models/Production");

async function generateBatchId() {
  try {
    // Fetch the latest batch ID from the ProductionJD table
    const latestProduction = await ProductionJD.findOne({
      order: [["id", "DESC"]], // Get the most recent entry based on ID
      attributes: ["batch"], // Only select the batch field
      limit: 1, // Limit to the most recent entry
    });

    // If no batch exists, we start with BATCH 1
    if (!latestProduction) {
      return "BATCH 1";
    }

    // Extract the numeric part of the batch (after "BATCH ")
    const lastBatchNumber = latestProduction.batch.replace("BATCH ", "");
    const nextBatchNumber = parseInt(lastBatchNumber, 10) + 1;

    // Return the next batch ID
    return `BATCH ${nextBatchNumber}`;
  } catch (error) {
    console.error("Error generating batch ID:", error);
    throw error;
  }
}

module.exports = generateBatchId;
