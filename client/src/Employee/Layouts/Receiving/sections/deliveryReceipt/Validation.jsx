// gatePassValidation.js

export const validateGatePassForm = (formData) => {
  const errors = [];

  if (formData.id && !formData.deliveryReceiptNo?.trim()) {
    errors.push("Delivery Receipt No is required.");
  }

  if (
    !formData.dateOfDelivery ||
    isNaN(new Date(formData.dateOfDelivery).getTime())
  ) {
    errors.push("Date of Delivery is required and must be a valid date.");
  }
  if (!formData.company || formData.company.trim() === "") {
    errors.push("Company is required.");
  }
  if (!formData.address || formData.address.trim() === "") {
    errors.push("Address is required.");
  }
  if (!formData.plateNumber || formData.plateNumber.trim() === "") {
    errors.push("Plate Number is required.");
  }
  if (!formData.driver || formData.driver.trim() === "") {
    errors.push("Driver is required.");
  }

  // Validate items array
  formData.items.forEach((item, index) => {
    if (!item.description || item.description.trim() === "") {
      errors.push(`Item ${index + 1}: Description is required.`);
    }
    if (!item.quantity || isNaN(item.quantity)) {
      errors.push(`Item ${index + 1}: Quantity must be a valid number.`);
    }
    if (!item.unit || item.unit.trim() === "") {
      errors.push(`Item ${index + 1}: Unit is required.`);
    }
  });

  return errors;
};
