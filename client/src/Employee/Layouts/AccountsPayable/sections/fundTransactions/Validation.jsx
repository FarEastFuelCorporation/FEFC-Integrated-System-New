// src/pages/sections/LegalServiceAgreements/Validation.jsx

export const FundTransactionValidation = (
  formData,
  existingErrorMessage = ""
) => {
  let existingErrors = existingErrorMessage
    ? new Set(existingErrorMessage.split(",").map((e) => e.trim()))
    : new Set();

  const addError = (msg) => existingErrors.add(msg);
  const removeIfPresent = (msg) => existingErrors.delete(msg);

  // Transaction Date
  const dateError = "Transaction date is required.";
  if (!formData.transactionDate || formData.transactionDate.trim() === "") {
    addError(dateError);
  } else {
    removeIfPresent(dateError);
  }

  // Fund Source
  const sourceError = "Fund source is required.";
  if (!formData.fundSource || formData.fundSource.trim() === "") {
    addError(sourceError);
  } else {
    removeIfPresent(sourceError);
  }

  // Fund Allocation
  const allocationError = "Fund allocation is required.";
  if (!formData.fundAllocation || formData.fundAllocation.trim() === "") {
    addError(allocationError);
  } else {
    removeIfPresent(allocationError);
  }

  // Fund Source should not equal Fund Allocation
  const sameFundError = "Fund source and allocation must be different.";
  if (
    formData.fundSource &&
    formData.fundAllocation &&
    formData.fundSource === formData.fundAllocation
  ) {
    addError(sameFundError);
  } else {
    removeIfPresent(sameFundError);
  }

  // Amount must be a number > 0
  const amountError = "Amount must be greater than 0.";
  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    addError(amountError);
  } else {
    removeIfPresent(amountError);
  }

  return Array.from(existingErrors);
};
