// controllers/commissionVerifyController.js

const BilledTransaction = require("../models/BilledTransaction");
const BookedTransaction = require("../models/BookedTransaction");
const CommissionedTransaction = require("../models/CommissionedTransaction");
const { getIncludeOptionsVerify } = require("../utils/getBookedTransactions");

// Get Commission Verify controller
async function getCommissionVerifyController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const commissionedTransaction = await CommissionedTransaction.findByPk(id, {
      include: {
        model: BookedTransaction,
        as: "BookedTransaction",
        include: getIncludeOptionsVerify(),
      },
    });

    res.json({ commissionedTransaction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCommissionVerifyController,
};
