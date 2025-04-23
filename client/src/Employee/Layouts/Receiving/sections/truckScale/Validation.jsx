// truckScaleValidation.js

export const validateTruckScaleForm = (formData) => {
  const errors = [];

  if (!formData.transactionType || formData.transactionType.trim() === "") {
    errors.push("Transaction Type is required.");
  }

  if (!formData.clientName || formData.clientName.trim() === "") {
    errors.push("Client Name is required.");
  }

  if (!formData.commodity || formData.commodity.trim() === "") {
    errors.push("Commodity is required.");
  }

  if (!formData.driver || formData.driver.trim() === "") {
    errors.push("Driver is required.");
  }

  if (!formData.plateNumber || formData.plateNumber.trim() === "") {
    errors.push("Plate Number is required.");
  }

  if (!formData.firstScaleDate) {
    errors.push("First Scale Date is required.");
  }

  if (!formData.firstScaleTime) {
    errors.push("First Scale Time is required.");
  }

  // Only require secondScaleDate and Time if updating
  if (formData.id) {
    if (!formData.secondScaleDate) {
      errors.push("Second Scale Date is required when updating.");
    }
    if (!formData.secondScaleTime) {
      errors.push("Second Scale Time is required when updating.");
    }
    if (!formData.netWeight || isNaN(formData.netWeight)) {
      errors.push("Net Weight must be a valid number.");
    }
  }

  // Conditional weight validation
  if (formData.transactionType === "INBOUND") {
    if (!formData.grossWeight || isNaN(formData.grossWeight)) {
      errors.push(
        "Gross Weight is required and must be a valid number for INBOUND transactions."
      );
    }
  }

  if (formData.transactionType === "OUTBOUND") {
    if (!formData.tareWeight || isNaN(formData.tareWeight)) {
      errors.push(
        "Tare Weight is required and must be a valid number for OUTBOUND transactions."
      );
    }
  }

  return errors;
};
