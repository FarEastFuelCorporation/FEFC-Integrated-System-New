// validateTransactionForm.js

export const validateTransactionForm = (formData) => {
  const errors = [];

  if (!formData.clientId || formData.clientId.trim() === "") {
    errors.push("Client is required.");
  }

  if (!formData.agentId || formData.agentId.trim() === "") {
    errors.push("Agent (Employee) is required.");
  }

  if (!formData.transactionDate) {
    errors.push("Transaction Date is required.");
  }

  if (!formData.createdBy) {
    errors.push("Created By is required.");
  }

  if (!Array.isArray(formData.items) || formData.items.length === 0) {
    errors.push("At least one item is required.");
  } else {
    formData.items.forEach((item, index) => {
      if (!item.quotationWasteId || item.quotationWasteId.trim() === "") {
        errors.push(`Item ${index + 1}: Type of Waste is required.`);
      }
      if (
        item.amount === undefined ||
        item.amount === null ||
        isNaN(item.amount) ||
        Number(item.amount) <= 0
      ) {
        errors.push(`Item ${index + 1}: Amount must be greater than 0.`);
      }
    });
  }

  return errors;
};
