const GatePass = require("../models/GatePass");

async function generateGatePassNumber() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // YY

    const latestEntry = await GatePass.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false,
    });

    let newSequence = 1;

    if (latestEntry && latestEntry.gatePassNo) {
      const latestNumber = latestEntry.gatePassNo;
      const latestYear = latestNumber.substring(2, 4); // Slice after 'GP'

      if (latestYear === currentYear) {
        const latestSeq = parseInt(latestNumber.substring(4), 10); // Extract XXXX
        newSequence = latestSeq + 1;
      }
    }

    const paddedSequence = newSequence.toString().padStart(4, "0");
    const newGatePassNumber = `GP${currentYear}${paddedSequence}`; // Format: GPYYXXXX

    return newGatePassNumber;
  } catch (error) {
    console.error("Error generating gate pass number:", error);
    throw error;
  }
}

module.exports = generateGatePassNumber;
