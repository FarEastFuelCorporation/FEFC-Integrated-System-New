// utils/generateCertificateNumber

const { Op } = require("sequelize"); // Import Sequelize operators
const CertifiedTransaction = require("../models/CertifiedTransaction");

async function generateCertificateNumber(typeOfCertificate) {
  try {
    // Get the current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    const prefix =
      typeOfCertificate === "CERTIFICATE OF ACCEPTANCE" ? "COA" : "COD";

    // Find the latest transaction ID with the specified prefix
    const latestTransaction = await CertifiedTransaction.findOne({
      where: {
        certificateNumber: {
          [Op.like]: `${prefix}%`, // Match certificateNumber starting with the prefix
        },
      },
      order: [["certificateNumber", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Handle the case where no record is found
    if (!latestTransaction) {
      console.log("No transactions found with the specified prefix.");
    } else {
      console.log("Latest Transaction:", latestTransaction);
    }

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.certificateNumber;
      const latestYear = latestTransactionId.substring(3, 7);
      if (latestYear === currentYear) {
        const latestIdNumber = parseInt(latestTransactionId.substring(9), 10);
        newIdNumber = latestIdNumber + 1;
      }
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(4, "0");
    const newTransactionId = `${prefix}${currentYear}${currentMonth}${newIdString}`;

    return newTransactionId;
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    throw error;
  }
}

module.exports = generateCertificateNumber;
