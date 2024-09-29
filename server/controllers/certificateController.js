// controllers/certificateController.js

const BookedTransaction = require("../models/BookedTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const { getIncludeOptions } = require("../utils/getBookedTransactions");

// Get Certificate controller
async function getCertificateController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const certifiedTransaction = await CertifiedTransaction.findByPk(id, {
      include: {
        model: BookedTransaction,
        as: "BookedTransaction",
        include: getIncludeOptions(),
      },
    });

    res.json({ certifiedTransaction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCertificateController,
};
