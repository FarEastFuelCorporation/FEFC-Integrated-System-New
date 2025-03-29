// Validation.jsx

export const Validation = (formData) => {
  let validationErrors = [];

  // Validate transactionDate
  if (!formData.transactionDate || formData.transactionDate.trim() === "") {
    validationErrors.push("Transaction Date is required.");
  }

  // Validate transactions array
  if (
    !Array.isArray(formData.transactions) ||
    formData.transactions.length === 0
  ) {
    validationErrors.push("At least one transaction is required.");
  } else {
    formData.transactions.forEach((transaction, index) => {
      if (
        !transaction.transactionCategory ||
        transaction.transactionCategory.trim() === ""
      ) {
        validationErrors.push(
          `Transaction ${index + 1}: Transaction Category is required.`
        );
      }
      if (
        !transaction.transactionDetails ||
        transaction.transactionDetails.trim() === ""
      ) {
        validationErrors.push(
          `Transaction ${index + 1}: Transaction Details are required.`
        );
      }
      if (!transaction.fundSource || transaction.fundSource.trim() === "") {
        validationErrors.push(
          `Transaction ${index + 1}: Fund Source is required.`
        );
      }
      if (
        !transaction.fundAllocation ||
        transaction.fundAllocation.trim() === ""
      ) {
        validationErrors.push(
          `Transaction ${index + 1}: Fund Allocation is required.`
        );
      }
      if (
        !transaction.amount ||
        isNaN(transaction.amount) ||
        Number(transaction.amount) <= 0
      ) {
        validationErrors.push(
          `Transaction ${index + 1}: Amount must be greater than zero.`
        );
      }
      if (
        (transaction.quantity && isNaN(transaction.quantity)) ||
        (transaction.unitPrice && isNaN(transaction.unitPrice))
      ) {
        validationErrors.push(
          `Transaction ${
            index + 1
          }: Quantity and Unit Price must be valid numbers.`
        );
      }
    });
  }

  return validationErrors;
};
