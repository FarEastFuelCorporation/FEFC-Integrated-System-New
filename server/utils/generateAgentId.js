// utils/generateAgentId.js

const Agent = require("../models/Agent");

async function generateAgentId() {
  try {
    // Find the latest Agent ID
    const latestAgent = await Agent.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    let newSequence = 1;

    if (latestAgent && latestAgent.agentId) {
      const latestId = latestAgent.agentId;
      const latestSeq = parseInt(latestId, 10);
      if (!isNaN(latestSeq)) {
        newSequence = latestSeq + 1;
      }
    }

    // Format as 3-digit number with leading zeros
    const newAgentId = newSequence.toString().padStart(3, "0");

    return newAgentId;
  } catch (error) {
    console.error("Error generating agent ID:", error);
    throw error;
  }
}

module.exports = generateAgentId;
