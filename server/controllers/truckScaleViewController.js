// controllers/truckScaleViewController.js

const Employee = require("../models/Employee");
const TruckScale = require("../models/TruckScale");

// Get Truck Scale View controller
async function getTruckScaleViewController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const truckScale = await TruckScale.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Employee,
          as: "Employee2",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.json({ truckScale });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getTruckScaleViewController,
};
