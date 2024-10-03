// utils/generateThirdPartyLogisticsId

const ThirdPartyLogistics = require("../models/ThirdPartyLogistics");
const { Op } = require("sequelize");

async function generateThirdPartyLogisticsId() {
  try {
    const prefix = "TPL"; // Define the prefix for the tpl ID

    // Find the latest tpl ID that matches the prefix, including soft-deleted records
    const latestClient = await ThirdPartyLogistics.findOne({
      where: {
        tplId: {
          [Op.like]: `${prefix}-%`, // Look for tpl IDs starting with the prefix "TPL-"
        },
      },
      order: [["createdAt", "DESC"]], // Get the most recently created tpl
      paranoid: false, // Include soft-deleted records
    });

    // Generate a new tpl ID
    let newIdNumber = 1; // Default to 1 if no existing records are found
    if (latestClient) {
      const latestClientId = latestClient.tplId; // Extract the latest tpl ID
      const latestIdNumber = parseInt(latestClientId.split("-")[1], 10); // Get the numeric part of the ID
      newIdNumber = latestIdNumber + 1; // Increment the number for the new ID
    }

    // Pad the numeric part with leading zeros to ensure it's always 3 digits
    const newIdString = newIdNumber.toString().padStart(3, "0");
    const newClientId = `${prefix}-${newIdString}`; // Format the new tpl ID as TPL-001, TPL-002, etc.

    return newClientId;
  } catch (error) {
    console.error("Error generating client ID:", error);
    throw error;
  }
}

module.exports = generateThirdPartyLogisticsId;
