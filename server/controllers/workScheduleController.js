// controllers/workScheduleController.js

const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const WorkSchedule = require("../models/WorkSchedule");

// Create WorkSchedule controller
async function createWorkScheduleController(req, res) {
  try {
    // Extracting data from the request body
    let {
      employeeId,
      typeOfSchedule,
      weekNumber,
      mondayIn,
      mondayOut,
      tuesdayIn,
      tuesdayOut,
      wednesdayIn,
      wednesdayOut,
      thursdayIn,
      thursdayOut,
      fridayIn,
      fridayOut,
      saturdayIn,
      saturdayOut,
      sundayIn,
      sundayOut,
      remarks,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Creating a new travel order
    await WorkSchedule.create({
      employeeId,
      typeOfSchedule,
      weekNumber,
      mondayIn,
      mondayOut,
      tuesdayIn,
      tuesdayOut,
      wednesdayIn,
      wednesdayOut,
      thursdayIn,
      thursdayOut,
      fridayIn,
      fridayOut,
      saturdayIn,
      saturdayOut,
      sundayIn,
      sundayOut,
      remarks,
      createdBy,
    });

    // Fetch all workSchedules from the database
    const workSchedules = await WorkSchedule.findAll({
      where: {
        employeeId: employeeId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ workSchedules });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get WorkSchedules controller
async function getWorkSchedulesController(req, res) {
  try {
    // Fetch all workSchedules from the database
    const workSchedules = await WorkSchedule.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: [
            "employeeId",
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
          as: "EmployeeCreatedBy",
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

    res.json({ workSchedules });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get WorkSchedule controller
async function getWorkScheduleController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all workSchedules from the database
    const workSchedules = await WorkSchedule.findAll({
      where: {
        employeeId: id,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: [
            "employeeId",
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
          as: "EmployeeCreatedBy",
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
    });

    res.json({ workSchedules });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const { Op } = require("sequelize");

// Get WorkSchedule Subordinate controller
async function getSubordinateController(req, res) {
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
      order: [["employee_id", "ASC"]],
    });

    res.json({ subordinates });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get WorkSchedule Subordinate controller
async function getWorkScheduleSubordinateController(req, res) {
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

    // Fetch all workSchedules from the database
    const workSchedules = await WorkSchedule.findAll({
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

    res.json({ workSchedules });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update WorkSchedule controller
async function updateWorkScheduleController(req, res) {
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

    reason = reason.toUpperCase();

    // Find the travel order by ID and update it
    const updatedWorkSchedule = await WorkSchedule.findByPk(id);

    if (updatedWorkSchedule) {
      // Update travel order attributes
      updatedWorkSchedule.startDate = startDate;
      updatedWorkSchedule.endDate = endDate;
      updatedWorkSchedule.isHalfDay = isHalfDay;
      updatedWorkSchedule.startTime = startTime;
      updatedWorkSchedule.endTime = endTime;
      updatedWorkSchedule.duration = duration;
      updatedWorkSchedule.reason = reason;

      // Save the updated travel order
      await updatedWorkSchedule.save();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} updated successfully`,
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

// Update WorkSchedule Subordinate Approved controller
async function updateWorkScheduleSubordinateApprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedWorkSchedule = await WorkSchedule.findByPk(id);

    if (updatedWorkSchedule) {
      // Update travel order attributes
      updatedWorkSchedule.isApproved = "APPROVED";

      // Save the updated travel order
      await updatedWorkSchedule.save();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} updated successfully`,
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

// Update WorkSchedule Subordinate Disapproved controller
async function updateWorkScheduleSubordinateDisapprovedController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedWorkSchedule = await WorkSchedule.findByPk(id);

    if (updatedWorkSchedule) {
      // Update travel order attributes
      updatedWorkSchedule.isApproved = "DISAPPROVED";

      // Save the updated travel order
      await updatedWorkSchedule.save();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} updated successfully`,
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

// Update WorkSchedule Subordinate Approved 2 controller
async function updateWorkScheduleSubordinateApproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedWorkSchedule = await WorkSchedule.findByPk(id);

    if (updatedWorkSchedule) {
      // Update travel order attributes
      updatedWorkSchedule.isNoted = "APPROVED";

      // Save the updated travel order
      await updatedWorkSchedule.save();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} updated successfully`,
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

// Update WorkSchedule Subordinate Disapproved 2 controller
async function updateWorkScheduleSubordinateDisapproved2Controller(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating travel order with ID:", id);

    // Find the travel order by ID and update it
    const updatedWorkSchedule = await WorkSchedule.findByPk(id);

    if (updatedWorkSchedule) {
      // Update travel order attributes
      updatedWorkSchedule.isNoted = "DISAPPROVED";

      // Save the updated travel order
      await updatedWorkSchedule.save();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} updated successfully`,
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

// Delete WorkSchedule controller
async function deleteWorkScheduleController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting WorkSchedule with ID:", id);

    // Find the WorkSchedule by ID
    const leaveToDelete = await WorkSchedule.findByPk(id);

    if (leaveToDelete) {
      // Soft delete the WorkSchedule (sets deletedAt timestamp)
      await leaveToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `WorkSchedule with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If WorkSchedule with the specified ID was not found
      res.status(404).json({ message: `WorkSchedule with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting WorkSchedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createWorkScheduleController,
  getWorkSchedulesController,
  getWorkScheduleController,
  getSubordinateController,
  getWorkScheduleSubordinateController,
  updateWorkScheduleController,
  updateWorkScheduleSubordinateApprovedController,
  updateWorkScheduleSubordinateDisapprovedController,
  updateWorkScheduleSubordinateApproved2Controller,
  updateWorkScheduleSubordinateDisapproved2Controller,
  deleteWorkScheduleController,
};
