// controllers/payrollController.js

const Employee = require("../models/Employee");
const EmployeeRecord = require("../models/EmployeeRecord");
const Payroll = require("../models/Payroll");
const PayrollAdjustment = require("../models/PayrollAdjustment");
const PayrollDeduction = require("../models/PayrollDeduction");

// Create Payroll controller
async function createPayrollController(req, res) {
  try {
    // Extracting data from the request body
    const {
      employeeId,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      year,
      weekNumber,
      paidBreak,
      scheduledIn,
      scheduledOut,
      deductions,
      adjustments,
      totalGrossAmount,
      totalDeductionAmount,
      totalAdjustmentAmount,
      netAmount,
      createdBy,
    } = req.body;

    const dayFields = {};
    for (let i = 1; i <= 16; i++) {
      const dayKey = `day${i}`;
      const inKey = `${dayKey}In`;
      const outKey = `${dayKey}Out`;

      dayFields[dayKey] =
        typeof req.body[dayKey] === "string"
          ? req.body[dayKey]
          : Array.isArray(req.body[dayKey])
          ? req.body[dayKey].join(",") // Convert array to comma-separated string
          : req.body[dayKey]?.toString() || "";

      dayFields[inKey] = req.body[inKey] || null;
      dayFields[outKey] = req.body[outKey] || null;
    }

    const employeeSalaryPayload = {
      employeeId,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      year,
      weekNumber,
      paidBreak,
      scheduledIn,
      scheduledOut,
      createdBy,
      totalGrossAmount: parseFloat(totalGrossAmount),
      totalDeductionAmount: parseFloat(totalDeductionAmount),
      totalAdjustmentAmount: parseFloat(totalAdjustmentAmount),
      netAmount: parseFloat(netAmount),
      ...dayFields,
    };

    // Step 1: Create Payroll record
    const newPayroll = await Payroll.create(employeeSalaryPayload);

    // Step 2: Insert Deductions if provided
    if (Array.isArray(deductions) && deductions.length > 0) {
      const deductionRecords = deductions.map((d) => ({
        payrollId: newPayroll.id,
        deduction: d.deduction,
        otherDeduction: d.otherDeduction || null,
        deductionAmount: parseFloat(d.deductionAmount || 0),
      }));
      await PayrollDeduction.bulkCreate(deductionRecords);
    }

    // Step 3: Insert Adjustments if provided
    if (Array.isArray(adjustments) && adjustments.length > 0) {
      const adjustmentRecords = adjustments.map((a) => ({
        payrollId: newPayroll.id,
        deduction: a.deduction,
        adjustment: a.adjustment || null,
        adjustmentAmount: parseFloat(a.adjustmentAmount || 0),
      }));
      await PayrollAdjustment.bulkCreate(adjustmentRecords);
    }

    const newPayrollFetch = await Payroll.findByPk(newPayroll.id, {
      include: [
        {
          model: PayrollDeduction,
          as: "PayrollDeduction",
          order: [["deduction", "ASC"]],
        },
        {
          model: PayrollAdjustment,
          as: "PayrollAdjustment",
          order: [["adjustment", "ASC"]],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
            "designation",
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecordCreatedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
          ],
        },
      ],
    });

    res.json({ newPayroll: newPayrollFetch });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Payrolls controller
async function getPayrollsController(req, res) {
  try {
    // Fetch all employeeSalaries from the database
    const payrolls = await Payroll.findAll({
      include: [
        {
          model: PayrollDeduction,
          as: "PayrollDeduction",
          order: [["deduction", "ASC"]],
        },
        {
          model: PayrollAdjustment,
          as: "PayrollAdjustment",
          order: [["adjustment", "ASC"]],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
            "designation",
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecordCreatedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
          ],
        },
      ],
    });

    res.json({ payrolls });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Payroll controller
async function getPayrollController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all employeeSalaries from the database
    const employeeSalaries = await Payroll.findAll({
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
          as: "PayrollCreatedBy",
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

// Update Payroll controller
async function updatePayrollController(req, res) {
  try {
    const { id } = req.params;

    const {
      employeeId,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      year,
      weekNumber,
      paidBreak,
      scheduledIn,
      scheduledOut,
      deductions,
      adjustments,
      totalGrossAmount,
      totalDeductionAmount,
      totalAdjustmentAmount,
      netAmount,
      createdBy,
    } = req.body;

    const dayFields = {};
    for (let i = 1; i <= 16; i++) {
      const dayKey = `day${i}`;
      const inKey = `${dayKey}In`;
      const outKey = `${dayKey}Out`;

      dayFields[dayKey] =
        typeof req.body[dayKey] === "string"
          ? req.body[dayKey]
          : Array.isArray(req.body[dayKey])
          ? req.body[dayKey].join(",")
          : req.body[dayKey]?.toString() || "";

      dayFields[inKey] = req.body[inKey] || null;
      dayFields[outKey] = req.body[outKey] || null;
    }

    const updatedPayload = {
      employeeId,
      payrollType,
      salaryType,
      compensationType,
      salary,
      dayAllowance,
      year,
      weekNumber,
      paidBreak,
      scheduledIn,
      scheduledOut,
      createdBy,
      totalGrossAmount: parseFloat(totalGrossAmount),
      totalDeductionAmount: parseFloat(totalDeductionAmount),
      totalAdjustmentAmount: parseFloat(totalAdjustmentAmount),
      netAmount: parseFloat(netAmount),
      ...dayFields,
    };

    // Step 1: Update Payroll
    await Payroll.update(updatedPayload, {
      where: { id },
    });

    // Step 2: Remove existing deductions and adjustments
    await PayrollDeduction.destroy({ where: { payrollId: id } });
    await PayrollAdjustment.destroy({ where: { payrollId: id } });

    // Step 3: Re-insert deductions
    if (Array.isArray(deductions) && deductions.length > 0) {
      const deductionRecords = deductions.map((d) => ({
        payrollId: id,
        deduction: d.deduction,
        otherDeduction: d.otherDeduction || null,
        deductionAmount: parseFloat(d.deductionAmount || 0),
      }));
      await PayrollDeduction.bulkCreate(deductionRecords);
    }

    // Step 4: Re-insert adjustments
    if (Array.isArray(adjustments) && adjustments.length > 0) {
      const adjustmentRecords = adjustments.map((a) => ({
        payrollId: id,
        deduction: a.deduction,
        adjustment: a.adjustment || null,
        adjustmentAmount: parseFloat(a.adjustmentAmount || 0),
      }));
      await PayrollAdjustment.bulkCreate(adjustmentRecords);
    }

    // Step 5: Fetch updated record
    const updatedPayroll = await Payroll.findByPk(id, {
      include: [
        {
          model: PayrollDeduction,
          as: "PayrollDeduction",
          order: [["deduction", "ASC"]],
        },
        {
          model: PayrollAdjustment,
          as: "PayrollAdjustment",
          order: [["adjustment", "ASC"]],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
            "designation",
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecordCreatedBy",
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "husbandSurname",
            "affix",
          ],
        },
      ],
    });

    res.json({ updatedPayroll });
  } catch (error) {
    console.error("Error updating payroll:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Payroll controller
async function deletePayrollController(req, res) {
  try {
    const id = req.params.id;

    console.log("Soft deleting Payroll with ID:", id);

    // Find the Payroll by ID
    const leaveToDelete = await Payroll.findByPk(id);

    if (leaveToDelete) {
      // Soft delete the Payroll (sets deletedAt timestamp)
      await leaveToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Payroll with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Payroll with the specified ID was not found
      res.status(404).json({ message: `Payroll with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Payroll:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createPayrollController,
  getPayrollsController,
  getPayrollController,
  updatePayrollController,
  deletePayrollController,
};
