// controllers/leaveController.js

const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Leave = require("../models/Leave");

// Create Leave controller
async function createLeaveController(req, res) {
  try {
    // Extracting data from the request body
    let {
      employeeId,
      typeOfLeave,
      startDate,
      endDate,
      isHalfDay,
      startTime,
      endTime,
      duration,
      reason,
    } = req.body;

    reason = reason && reason.toUpperCase();

    // Creating a new travel order
    await Leave.create({
      employeeId,
      typeOfLeave,
      startDate,
      endDate,
      isHalfDay,
      startTime,
      endTime,
      duration,
      reason,
    });

    // Fetch all leaves from the database
    const leaves = await Leave.findAll({
      where: {
        employeeId: employeeId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ leaves });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Leaves controller
async function getLeavesController(req, res) {
  try {
    // Fetch all leaves from the database
    const leaves = await Leave.findAll({
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

    res.json({ leaves });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Leave controller
async function getLeaveController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all leaves from the database
    const leaves = await Leave.findAll({
      where: {
        employeeId: id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ leaves });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const { Op } = require("sequelize");

// Get Leave Subordinate controller
async function getLeaveSubordinateController(req, res) {
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

    // Fetch all leaves from the database
    const leaves = await Leave.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    res.json({ leaves });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Leave controller
async function updateLeaveController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    let {
      startDate,
      endDate,
      isHalfDay,
      startTime,
      endTime,
      duration,
      reason,
    } = req.body;

    reason = reason && reason.toUpperCase();

    // Find the travel order by ID and update it
    const updatedLeave = await Leave.findByPk(id);

    if (updatedLeave) {
      // Update travel order attributes
      updatedLeave.startDate = startDate;
      updatedLeave.endDate = endDate;
      updatedLeave.isHalfDay = isHalfDay;
      updatedLeave.startTime = startTime;
      updatedLeave.endTime = endTime;
      updatedLeave.duration = duration;
      updatedLeave.reason = reason;

      // Save the updated travel order
      await updatedLeave.save();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} updated successfully`,
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

// Update Leave Subordinate Approved controller
async function updateLeaveSubordinateApprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedLeave = await Leave.findByPk(id);

    if (updatedLeave) {
      // Update travel order attributes
      updatedLeave.isApproved = "APPROVED";

      // Save the updated travel order
      await updatedLeave.save();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} updated successfully`,
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

// Update Leave Subordinate Disapproved controller
async function updateLeaveSubordinateDisapprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedLeave = await Leave.findByPk(id);

    if (updatedLeave) {
      // Update travel order attributes
      updatedLeave.isApproved = "DISAPPROVED";
      updatedLeave.isNoted = "DISAPPROVED";

      // Save the updated travel order
      await updatedLeave.save();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} updated successfully`,
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

// Update Leave Subordinate Approved 2 controller
async function updateLeaveSubordinateApproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedLeave = await Leave.findByPk(id);

    if (updatedLeave) {
      // Update travel order attributes
      updatedLeave.isNoted = "APPROVED";

      // Save the updated travel order
      await updatedLeave.save();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} updated successfully`,
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

// Update Leave Subordinate Disapproved 2 controller
async function updateLeaveSubordinateDisapproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedLeave = await Leave.findByPk(id);

    if (updatedLeave) {
      // Update travel order attributes
      updatedLeave.isNoted = "DISAPPROVED";

      // Save the updated travel order
      await updatedLeave.save();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} updated successfully`,
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

// Delete Leave controller
async function deleteLeaveController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting Leave with ID:", id);

    // Find the Leave by ID
    const leaveToDelete = await Leave.findByPk(id);

    if (leaveToDelete) {
      // Soft delete the Leave (sets deletedAt timestamp)
      await leaveToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Leave with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Leave with the specified ID was not found
      res.status(404).json({ message: `Leave with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Leave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createLeaveController,
  getLeavesController,
  getLeaveController,
  getLeaveSubordinateController,
  updateLeaveController,
  updateLeaveSubordinateApprovedController,
  updateLeaveSubordinateDisapprovedController,
  updateLeaveSubordinateApproved2Controller,
  updateLeaveSubordinateDisapproved2Controller,
  deleteLeaveController,
};
