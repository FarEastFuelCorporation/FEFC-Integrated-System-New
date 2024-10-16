// controllers/travelOrderVerifyController.js

const Employee = require("../models/Employee");
const TravelOrder = require("../models/TravelOrder");

// Get Travel Order Verify controller
async function getTravelOrderVerifyController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all travelOrders from the database
    const travelOrder = await TravelOrder.findByPk(id, {
      include: {
        model: Employee,
        as: "Employee",
        attributes: [
          "firstName",
          "middleName",
          "lastName",
          "affix",
          "department",
          "designation",
        ],
      },
    });

    res.json({ travelOrder });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Travel Order Verify controller
async function updateTravelOrderVerifyController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id, {
      include: {
        model: Employee,
        as: "Employee",
        attributes: [
          "firstName",
          "middleName",
          "lastName",
          "affix",
          "department",
          "designation",
        ],
      },
    });

    const timestamp = new Date();

    if (updatedTravelOrder) {
      if (updatedTravelOrder.out) {
        // Update travel order attributes
        updatedTravelOrder.in = timestamp;
      }
      if (!updatedTravelOrder.out) {
        // Update travel order attributes
        updatedTravelOrder.out = timestamp;
      }

      // Save the updated travel order
      await updatedTravelOrder.save();

      // Respond with the updated travel order data
      res.json({
        updatedTravelOrder,
      });
    } else {
      // If travel order with the specified ID was not found
      res.status(404).json({ message: `Travel order with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating travel order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTravelOrderVerifyController,
  updateTravelOrderVerifyController,
};
