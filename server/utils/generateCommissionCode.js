const { Op } = require("sequelize");
const moment = require("moment");
const Commission = require("../models/Commission"); // adjust the path to your model

async function generateCommissionCode() {
  const currentYear = moment().format("YYYY");

  // Find the latest commission for the current year
  const latestCommission = await Commission.findOne({
    where: {
      commissionCode: {
        [Op.like]: `COM-${currentYear}-%`,
      },
    },
    order: [["commissionCode", "DESC"]],
    paranoid: false,
  });

  let nextSequence = 1;

  if (latestCommission) {
    const latestCode = latestCommission.commissionCode; // e.g., COM-2025-012
    const parts = latestCode.split("-");
    const lastSeq = parseInt(parts[2], 10);
    nextSequence = lastSeq + 1;
  }

  const paddedSequence = String(nextSequence).padStart(3, "0");

  return `COM-${currentYear}-${paddedSequence}`;
}

module.exports = generateCommissionCode;
