const TruckScale = require("../models/TruckScale");

async function generateTruckScaleNumber() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // YY

    const latestEntry = await TruckScale.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false,
    });

    let newSequence = 1;

    if (latestEntry && latestEntry.truckScaleNo) {
      const latestNumber = latestEntry.truckScaleNo;
      const latestYear = latestNumber.substring(2, 4); // Slice after 'TS'

      if (latestYear === currentYear) {
        const latestSeq = parseInt(latestNumber.substring(4), 10); // Extract XXXX
        newSequence = latestSeq + 1;
      }
    }

    const paddedSequence = newSequence.toString().padStart(4, "0");
    const newTruckScaleNumber = `TS${currentYear}${paddedSequence}`; // Format: TSYYXXXX

    return newTruckScaleNumber;
  } catch (error) {
    console.error("Error generating truck scale number:", error);
    throw error;
  }
}

module.exports = generateTruckScaleNumber;
