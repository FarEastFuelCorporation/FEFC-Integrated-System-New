// controllers/deliveryReceiptViewController.js

const DeliveryReceipt = require("../models/DeliveryReceipt");
const DeliveryReceiptItem = require("../models/DeliveryReceiptItem");
const Employee = require("../models/Employee");

// Get Delivery Receipt View controller
async function getDeliveryReceiptViewController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const deliveryReceipt = await DeliveryReceipt.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: DeliveryReceiptItem,
          as: "DeliveryReceiptItem",
        },
      ],
    });

    res.json({ deliveryReceipt });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getDeliveryReceiptViewController,
};
