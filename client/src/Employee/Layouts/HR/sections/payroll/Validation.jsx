// src/components/Dashboard/Validation.jsx

export const PayrollValidation = (formData) => {
  const errors = [];

  // Required top-level fields
  if (!formData.employeeId || formData.employeeId.trim() === "") {
    errors.push("Employee ID is required.");
  }

  if (!formData.payrollType) {
    errors.push("Payroll Type is required.");
  }

  if (!formData.salaryType) {
    errors.push("Salary Type is required.");
  }

  if (!formData.compensationType) {
    errors.push("Compensation Type is required.");
  }

  if (!formData.salary || isNaN(formData.salary)) {
    errors.push("Valid Salary is required.");
  }

  if (isNaN(formData.dayAllowance)) {
    errors.push("Valid Day Allowance is required.");
  }

  if (!formData.year || isNaN(formData.year)) {
    errors.push("Year is required.");
  }

  if (
    formData.payrollType === "WEEKLY" &&
    (!formData.weekNumber || formData.weekNumber.trim() === "")
  ) {
    errors.push("Week Number is required for Weekly payrolls.");
  }

  if (!formData.scheduledIn) {
    errors.push("Scheduled In time is required.");
  }

  if (!formData.scheduledOut) {
    errors.push("Scheduled Out time is required.");
  }

  // Validate deductions
  if (Array.isArray(formData.deductions)) {
    formData.deductions.forEach((deduction, index) => {
      if (!deduction.deduction || deduction.deduction.trim() === "") {
        errors.push(`Deduction name is required at index ${index + 1}.`);
      }
      if (
        deduction.deductionAmount === undefined ||
        deduction.deductionAmount === null ||
        deduction.deductionAmount === "" ||
        isNaN(deduction.deductionAmount)
      ) {
        errors.push(
          `Valid deduction amount is required at index ${index + 1}.`
        );
      }
    });
  }

  // Validate adjustments
  if (Array.isArray(formData.adjustments)) {
    formData.adjustments.forEach((adjustment, index) => {
      if (!adjustment.deduction || adjustment.deduction.trim() === "") {
        errors.push(
          `Adjustment deduction type is required at index ${index + 1}.`
        );
      }
      if (
        adjustment.adjustmentAmount === undefined ||
        adjustment.adjustmentAmount === null ||
        adjustment.adjustmentAmount === "" ||
        isNaN(adjustment.adjustmentAmount)
      ) {
        errors.push(
          `Valid adjustment amount is required at index ${index + 1}.`
        );
      }
    });
  }

  return errors;
};
