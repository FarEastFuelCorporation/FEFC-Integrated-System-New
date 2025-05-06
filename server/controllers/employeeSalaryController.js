// controllers/employeeSalaryController.js

const XLSX = require("xlsx");
const Employee = require("../models/Employee");
const EmployeeSalary = require("../models/EmployeeSalary");

// Create EmployeeSalary controller
async function createEmployeeSalaryController(req, res) {
  try {
    // Extracting data from the request body
    const {
      employeeId,
      designation,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      nightAllowance,
      createdBy,
    } = req.body;

    // Create a new overtime record
    await EmployeeSalary.create({
      employeeId,
      designation,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      nightAllowance,
      createdBy,
    });

    // Fetch all employeeSalaries from the database
    const employeeSalaries = await EmployeeSalary.findAll({
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
          order: [["employeeId", "ASC"]],
        },
        {
          model: Employee,
          as: "EmployeeSalaryCreatedBy",
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

    res.json({ employeeSalaries });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get EmployeeSalaries controller
async function getEmployeeSalariesController(req, res) {
  try {
    // Fetch all employeeSalaries from the database
    const employeeSalaries = await EmployeeSalary.findAll({
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
          order: [["employeeId", "ASC"]],
        },
        {
          model: Employee,
          as: "EmployeeSalaryCreatedBy",
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

    res.json({ employeeSalaries });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get EmployeeSalary controller
async function getEmployeeSalaryController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all employeeSalaries from the database
    const employeeSalaries = await EmployeeSalary.findAll({
      where: {
        employeeId: id,
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
          order: [["employeeId", "ASC"]],
        },
        {
          model: Employee,
          as: "EmployeeSalaryCreatedBy",
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

    res.json({ employeeSalaries });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update EmployeeSalary controller
async function updateEmployeeSalaryController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating EmployeeSalary with ID:", id);

    // Extracting data from the request body
    const {
      employeeId,
      designation,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      nightAllowance,
      createdBy,
    } = req.body;

    console.log(req.body);

    // Find the overtime by ID and update it
    const updatedEmployeeSalary = await EmployeeSalary.findByPk(id);

    if (updatedEmployeeSalary) {
      // Update overtime attributes
      updatedEmployeeSalary.employeeId = employeeId;
      updatedEmployeeSalary.designation = designation;
      updatedEmployeeSalary.payrollType = payrollType;
      updatedEmployeeSalary.salaryType = salaryType;
      updatedEmployeeSalary.compensationType = compensationType;
      updatedEmployeeSalary.salary = salary;
      updatedEmployeeSalary.dayAllowance = dayAllowance;
      updatedEmployeeSalary.nightAllowance = nightAllowance;
      updatedEmployeeSalary.createdBy = createdBy;

      // Save the updated overtime
      await updatedEmployeeSalary.save();

      // Respond with a success message
      res.json({
        message: `EmployeeSalary with ID ${id} updated successfully`,
      });
    } else {
      // If overtime with the specified ID was not found
      res
        .status(404)
        .json({ message: `EmployeeSalary with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating overtime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete EmployeeSalary controller
async function deleteEmployeeSalaryController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting EmployeeSalary with ID:", id);

    // Find the EmployeeSalary by ID
    const leaveToDelete = await EmployeeSalary.findByPk(id);

    if (leaveToDelete) {
      // Soft delete the EmployeeSalary (sets deletedAt timestamp)
      await leaveToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `EmployeeSalary with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If EmployeeSalary with the specified ID was not found
      res
        .status(404)
        .json({ message: `EmployeeSalary with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting EmployeeSalary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Upload EmployeeSalary controller
const uploadEmployeeSalaryExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded." });

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const salaryEntries = jsonData.map((row) => ({
      id: uuidv4(),
      employeeId: row.employeeId,
      payrollType: row.payrollType,
      salaryType: row.salaryType,
      compensationType: row.compensationType,
      salary: row.salary,
      dayAllowance: row.dayAllowance,
      nightAllowance: row.nightAllowance,
      createdBy: row.createdBy || null,
    }));

    await EmployeeSalary.bulkCreate(salaryEntries);

    res.status(200).json({ message: "Excel data uploaded successfully." });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading data", error });
  }
};

module.exports = {
  createEmployeeSalaryController,
  getEmployeeSalariesController,
  getEmployeeSalaryController,
  updateEmployeeSalaryController,
  deleteEmployeeSalaryController,
  uploadEmployeeSalaryExcel,
};
