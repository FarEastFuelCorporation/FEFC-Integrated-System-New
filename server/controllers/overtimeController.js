// controllers/overtimeController.js

const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Overtime = require("../models/Overtime");

// Create Overtime controller
async function createOvertimeController(req, res) {
  try {
    // Extracting data from the request body
    const { employeeId, entries } = req.body;

    // Check if entries is an array
    if (!Array.isArray(entries)) {
      return res.status(400).json({ message: "Entries should be an array." });
    }

    // Iterate over the entries array
    for (const entry of entries) {
      let { dateStart, timeStart, dateEnd, timeEnd, purpose } = entry;

      // Convert purpose to uppercase
      purpose = purpose && purpose.toUpperCase();

      // Create a new overtime record
      await Overtime.create({
        employeeId,
        dateStart,
        timeStart,
        dateEnd,
        timeEnd,
        purpose,
      });
    }

    // Fetch all overtimes from the database
    const overtimes = await Overtime.findAll({
      where: {
        employeeId: employeeId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ overtimes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Overtimes controller
async function getOvertimesController(req, res) {
  try {
    // Fetch all overtimes from the database
    const overtimes = await Overtime.findAll({
      include: [
        {
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
        {
          model: Employee,
          as: "EmployeeApprovedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "affix",
            "department",
            "designation",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ overtimes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Overtimes Approved controller
async function getOvertimesApprovedController(req, res) {
  try {
    // Fetch all overtimes from the database
    const overtimes = await Overtime.findAll({
      where: {
        isApproved: "APPROVED",
      },
      include: [
        {
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
        {
          model: Employee,
          as: "EmployeeApprovedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "affix",
            "department",
            "designation",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ overtimes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Overtime controller
async function getOvertimeController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all overtimes from the database
    const overtimes = await Overtime.findAll({
      where: {
        employeeId: id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ overtimes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const { Op } = require("sequelize");

// Get Overtime Subordinate controller
async function getOvertimeSubordinateController(req, res) {
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

    // Fetch all overtimes from the database
    const overtimes = await Overtime.findAll({
      include: [
        {
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
        {
          model: Employee,
          as: "EmployeeApprovedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "affix",
            "department",
            "designation",
          ],
        },
      ],
      where: {
        employeeId: {
          [Op.in]: subordinateIds, // Only get attendance for these subordinate IDs
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ overtimes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Overtime controller
async function updateOvertimeController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Overtime with ID:", id);

    // Extracting data from the request body
    const { entries } = req.body;

    console.log(req.body);

    let { dateStart, timeStart, dateEnd, timeEnd, purpose } = entries[0];

    // Find the overtime by ID and update it
    const updatedOvertime = await Overtime.findByPk(id);

    if (updatedOvertime) {
      // Update overtime attributes
      updatedOvertime.dateStart = dateStart;
      updatedOvertime.timeStart =
        timeStart.length === 5 ? `${timeStart}:00` : timeStart;
      updatedOvertime.dateEnd = dateEnd;
      updatedOvertime.timeEnd =
        timeEnd.length === 5 ? `${timeEnd}:00` : timeEnd;
      updatedOvertime.purpose = purpose;
      console.log(updatedOvertime);
      // Save the updated overtime
      await updatedOvertime.save();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Overtime Subordinate Approved controller
async function updateOvertimeSubordinateApprovedController(req, res) {
  try {
    const id = req.params.id;
    const { approvedBy } = req.body;

    console.log("Updating overtime with ID:", id);

    console.log(approvedBy);

    // Find the overtime by ID and update it
    const updatedOvertime = await Overtime.findByPk(id);

    if (updatedOvertime) {
      // Update overtime attributes
      updatedOvertime.isApproved = "APPROVED";
      updatedOvertime.approvedBy = approvedBy;

      // Save the updated overtime
      await updatedOvertime.save();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Overtime Subordinate Disapproved controller
async function updateOvertimeSubordinateDisapprovedController(req, res) {
  try {
    const id = req.params.id;
    const { approvedBy } = req.body;

    console.log("Updating overtime with ID:", id);

    // Find the overtime by ID and update it
    const updatedOvertime = await Overtime.findByPk(id);

    if (updatedOvertime) {
      // Update overtime attributes
      updatedOvertime.isApproved = "DISAPPROVED";
      updatedOvertime.approvedBy = approvedBy;

      // Save the updated overtime
      await updatedOvertime.save();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Overtime Subordinate Approved 2 controller
async function updateOvertimeSubordinateApproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating overtime with ID:", id);

    // Find the overtime by ID and update it
    const updatedOvertime = await Overtime.findByPk(id);

    if (updatedOvertime) {
      // Update overtime attributes
      updatedOvertime.isNoted = "APPROVED";

      // Save the updated overtime
      await updatedOvertime.save();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Overtime Subordinate Disapproved 2 controller
async function updateOvertimeSubordinateDisapproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating overtime with ID:", id);

    // Find the overtime by ID and update it
    const updatedOvertime = await Overtime.findByPk(id);

    if (updatedOvertime) {
      // Update overtime attributes
      updatedOvertime.isNoted = "DISAPPROVED";

      // Save the updated overtime
      await updatedOvertime.save();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Overtime controller
async function deleteOvertimeController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting Overtime with ID:", id);

    // Find the Overtime by ID
    const leaveToDelete = await Overtime.findByPk(id);

    if (leaveToDelete) {
      // Soft delete the Overtime (sets deletedAt timestamp)
      await leaveToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Overtime with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Overtime with the specified ID was not found
      res.status(404).json({ message: `Overtime with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createOvertimeController,
  getOvertimesController,
  getOvertimesApprovedController,
  getOvertimeController,
  getOvertimeSubordinateController,
  updateOvertimeController,
  updateOvertimeSubordinateApprovedController,
  updateOvertimeSubordinateDisapprovedController,
  updateOvertimeSubordinateApproved2Controller,
  updateOvertimeSubordinateDisapproved2Controller,
  deleteOvertimeController,
};
