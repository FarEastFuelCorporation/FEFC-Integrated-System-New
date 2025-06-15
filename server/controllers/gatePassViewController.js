// controllers/gatePassViewController.js

const GatePass = require("../models/GatePass");
const GatePassItem = require("../models/GatePassItem");
const Employee = require("../models/Employee");

// Get Delivery Receipt View controller
async function getGatePassViewController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const gatePass = await GatePass.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: GatePassItem,
          as: "GatePassItem",
        },
      ],
    });

    res.json({ gatePass });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getGatePassViewController,
};
