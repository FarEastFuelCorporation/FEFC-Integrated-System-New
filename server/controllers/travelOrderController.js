// controllers/travelOrderController.js

const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const TravelOrder = require("../models/TravelOrder");

// Create Travel Order controller
async function createTravelOrderController(req, res) {
  try {
    // Extracting data from the request body
    let {
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      destination,
      purpose,
      employeeId,
    } = req.body;

    destination = destination && destination.toUpperCase();
    purpose = purpose && purpose.toUpperCase();

    // Creating a new travel order
    await TravelOrder.create({
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      destination,
      purpose,
      employeeId,
    });

    // Fetch all travelOrders from the database
    const travelOrders = await TravelOrder.findAll({
      where: {
        employeeId: employeeId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ travelOrders });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Travel Orders controller
async function getTravelOrdersController(req, res) {
  try {
    // Fetch all travelOrders from the database
    const travelOrders = await TravelOrder.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    res.json({ travelOrders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Travel Order controller
async function getTravelOrderController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all travelOrders from the database
    const travelOrders = await TravelOrder.findAll({
      where: {
        employeeId: id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ travelOrders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const { Op } = require("sequelize");

// Get Travel Order Subordinate controller
async function getTravelOrderSubordinateController(req, res) {
  try {
    const id = req.params.id;

    // Step 1: Find all subordinates based on the immediateHeadId
    const subordinates = await IdInformation.findAll({
      where: {
        immediateHeadId: {
          [Op.or]: [
            { [Op.like]: `${id},%` }, // id at the start
            { [Op.like]: `%,${id},%` }, // id in the middle
            { [Op.like]: `%,${id}` }, // id at the end
            { [Op.like]: `${id}` }, // id is the only value
          ],
        },
      },
      attributes: [
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "affix",
        "designation",
        "birthday",
      ],
    });

    // Extract subordinate IDs from the result
    const subordinateIds = subordinates.map(
      (subordinate) => subordinate.employee_id
    );

    console.log(subordinateIds);

    // Fetch all travelOrders from the database
    const travelOrders = await TravelOrder.findAll({
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
      where: {
        employeeId: {
          [Op.in]: subordinateIds, // Only get attendance for these subordinate IDs
        },
      },
    });

    res.json({ travelOrders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Travel Order controller
async function updateTravelOrderController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    let {
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      destination,
      purpose,
    } = req.body;

    destination = destination && destination.toUpperCase();
    purpose = purpose && purpose.toUpperCase();

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id);

    if (updatedTravelOrder) {
      // Update travel order attributes
      updatedTravelOrder.departureDate = departureDate;
      updatedTravelOrder.departureTime = departureTime;
      updatedTravelOrder.arrivalDate = arrivalDate;
      updatedTravelOrder.arrivalTime = arrivalTime;
      updatedTravelOrder.destination = destination;
      updatedTravelOrder.purpose = purpose;

      // Save the updated travel order
      await updatedTravelOrder.save();

      const travelOrders = await TravelOrder.findAll();

      // Respond with the updated travel order data
      res.json({
        travelOrders,
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

// Update Travel Order Subordinate Approved controller
async function updateTravelOrderSubordinateApprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id);

    if (updatedTravelOrder) {
      // Update travel order attributes
      updatedTravelOrder.isApproved = "APPROVED";

      // Save the updated travel order
      await updatedTravelOrder.save();

      // Respond with a success message
      res.json({
        message: `TravelOrder with ID ${id} updated successfully`,
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

// Update Travel Order Subordinate Disapproved controller
async function updateTravelOrderSubordinateDisapprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id);

    if (updatedTravelOrder) {
      // Update travel order attributes
      updatedTravelOrder.isApproved = "DISAPPROVED";

      // Save the updated travel order
      await updatedTravelOrder.save();

      // Respond with a success message
      res.json({
        message: `TravelOrder with ID ${id} updated successfully`,
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

// Update Travel Order Subordinate Approved 2 controller
async function updateTravelOrderSubordinateApproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id);

    if (updatedTravelOrder) {
      // Update travel order attributes
      updatedTravelOrder.isNoted = "APPROVED";

      // Save the updated travel order
      await updatedTravelOrder.save();

      // Respond with a success message
      res.json({
        message: `TravelOrder with ID ${id} updated successfully`,
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

// Update Travel Order Subordinate Disapproved 2 controller
async function updateTravelOrderSubordinateDisapproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedTravelOrder = await TravelOrder.findByPk(id);

    if (updatedTravelOrder) {
      // Update travel order attributes
      updatedTravelOrder.isNoted = "DISAPPROVED";

      // Save the updated travel order
      await updatedTravelOrder.save();

      // Respond with a success message
      res.json({
        message: `TravelOrder with ID ${id} updated successfully`,
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

// Delete Travel Order controller
async function deleteTravelOrderController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting TravelOrder with ID:", id);

    // Find the TravelOrder by ID
    const travelOrderToDelete = await TravelOrder.findByPk(id);

    if (travelOrderToDelete) {
      // Soft delete the TravelOrder (sets deletedAt timestamp)
      await travelOrderToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `TravelOrder with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If TravelOrder with the specified ID was not found
      res.status(404).json({ message: `TravelOrder with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting TravelOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTravelOrderController,
  getTravelOrdersController,
  getTravelOrderController,
  getTravelOrderSubordinateController,
  updateTravelOrderController,
  updateTravelOrderSubordinateApprovedController,
  updateTravelOrderSubordinateDisapprovedController,
  updateTravelOrderSubordinateApproved2Controller,
  updateTravelOrderSubordinateDisapproved2Controller,
  deleteTravelOrderController,
};
