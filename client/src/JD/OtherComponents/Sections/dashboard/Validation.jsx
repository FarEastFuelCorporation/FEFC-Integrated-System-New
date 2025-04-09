// Validation.jsx

export const Validation = (formData) => {
  let validationErrors = [];

  // Validate processes and corresponding checks
  if (!formData.transactionDate || formData.transactionDate.trim() === "") {
    validationErrors.push("Transaction Date is required.");
  }
  if (
    !formData.transactionDetails ||
    formData.transactionDetails.trim() === ""
  ) {
    validationErrors.push("Transaction Details is required.");
  }
  if (
    !formData.transactionCategory ||
    formData.transactionCategory.trim() === ""
  ) {
    validationErrors.push("Transaction Category is required.");
  }
  if (!formData.fundSource || formData.fundSource.trim() === "") {
    validationErrors.push("Fund Source is required.");
  }
  if (!formData.fundAllocation || formData.fundAllocation.trim() === "") {
    validationErrors.push("Fund Allocation is required.");
  }
  if (!formData.amount || formData.amount.trim() === "") {
    validationErrors.push("Amount is required.");
  }

  // Return validation errors
  return validationErrors;
};
