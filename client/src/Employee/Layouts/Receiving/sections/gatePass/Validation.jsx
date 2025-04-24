// gatePassValidation.js

export const validateGatePassForm = (formData) => {
  const errors = [];

  if (formData.id && !formData.gatePassNo?.trim()) {
    errors.push("Gate Pass No is required.");
  }

  if (!formData.dateIn) {
    errors.push("Date In is required.");
  }

  if (!formData.timeIn) {
    errors.push("Time In is required.");
  }

  // If updating, require Date Out and Time Out
  if (formData.id) {
    if (!formData.dateOut) {
      errors.push("Date Out is required when updating.");
    }
    if (!formData.timeOut) {
      errors.push("Time Out is required when updating.");
    }
  }

  if (!formData.issuedTo || formData.issuedTo.trim() === "") {
    errors.push("Issued To is required.");
  }

  if (!formData.address || formData.address.trim() === "") {
    errors.push("Address is required.");
  }

  if (!formData.plateNumber || formData.plateNumber.trim() === "") {
    errors.push("Plate Number is required.");
  }

  if (!formData.vehicle || formData.vehicle.trim() === "") {
    errors.push("Vehicle is required.");
  }

  if (!formData.category || formData.category.trim() === "") {
    errors.push("Category is required.");
  }

  if (!formData.truckScaleNo || formData.truckScaleNo.trim() === "") {
    errors.push("Truck Scale No is required.");
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
