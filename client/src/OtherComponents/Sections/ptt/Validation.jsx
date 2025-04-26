// gatePassValidation.js

export const validateWasteForm = (formData) => {
  const errors = [];

  if (!formData.clientId || formData.clientId.trim() === "") {
    errors.push("Client is required.");
  }

  if (!formData.ptt || formData.ptt.trim() === "") {
    errors.push("PTT is required.");
  }

  if (!formData.approvedDate) {
    errors.push("Approved Date is required.");
  }

  formData.wastes.forEach((waste, index) => {
    if (!waste.wasteId || waste.wasteId === "") {
      errors.push(`Waste ${index + 1}: Type of Waste is required.`);
    }
    if (!waste.wasteName || waste.wasteName.trim() === "") {
      errors.push(`Waste ${index + 1}: Waste Name is required.`);
    }
    if (
      waste.quantity === undefined ||
      waste.quantity === null ||
      isNaN(waste.quantity) ||
      waste.quantity <= 0
    ) {
      errors.push(`Waste ${index + 1}: Quantity must be greater than 0.`);
    }
  });

  return errors;
};
