// controllers/certificateController.js

const Attachment = require("../models/Attachment");
const CertifiedTransaction = require("../models/CertifiedTransaction");

// Get Certificate controller
async function getCertificateController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const certifiedTransaction = await CertifiedTransaction.findByPk(id);

    const certificateAttachment = await Attachment.findOne({
      bookedTransactionId: certifiedTransaction.bookedTransactionId,
      fileName: "CERTIFICATE",
    });

    res.json({ certificateAttachment });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCertificateController,
};
