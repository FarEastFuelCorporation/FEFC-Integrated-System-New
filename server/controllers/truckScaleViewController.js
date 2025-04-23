// controllers/truckScaleViewController.js

const BookedTransaction = require("../models/BookedTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Client = require("../models/Client");
const PlasticTransaction = require("../models/PlasticTransaction");
const TruckScale = require("../models/TruckScale");
const { getIncludeOptionsVerify } = require("../utils/getBookedTransactions");

// Get Certificate of Destruction controller
async function getTruckScaleViewController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const truckScale = await TruckScale.findByPk(id, {});

    res.json({ truckScale });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getTruckScaleViewController,
};
