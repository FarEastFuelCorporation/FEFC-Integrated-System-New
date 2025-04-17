// utils/generateBatchId

const ProductionJD = require("../models/Production");

async function generateBatchId(type = "BATCH") {
  try {
    // Fetch the latest production entry matching the type prefix
    const latestProduction = await ProductionJD.findOne({
      where: {
        batch: {
          [require("sequelize").Op.like]: `${type} %`,
        },
      },
      order: [["id", "DESC"]],
      attributes: ["batch"],
      limit: 1,
    });

    if (!latestProduction) {
      return `${type} 1`;
    }

    const lastBatch = latestProduction.batch;
    const match = lastBatch.match(new RegExp(`^${type} (\\d+)$`));

    const lastNumber = match ? parseInt(match[1], 10) : 0;
    const nextNumber = lastNumber + 1;

    return `${type} ${nextNumber}`;
  } catch (error) {
    console.error("Error generating batch ID:", error);
    throw error;
  }
}

module.exports = generateBatchId;
