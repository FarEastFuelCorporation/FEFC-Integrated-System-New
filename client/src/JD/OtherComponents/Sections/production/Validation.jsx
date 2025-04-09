// Validation.jsx

export const Validation = (formData) => {
  let validationErrors = [];

  // Validate transactionDate
  if (!formData.transactionDate || formData.transactionDate.trim() === "") {
    validationErrors.push("Transaction Date is required.");
  }

  // Validate ingredients array
  if (
    !Array.isArray(formData.ingredients) ||
    formData.ingredients.length === 0
  ) {
    validationErrors.push("At least one ingredient is required.");
  } else {
    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.id) {
        validationErrors.push(`Ingredients ${index + 1}: Product is required.`);
      }
      if (
        ingredient.quantity === undefined ||
        ingredient.quantity === null ||
        isNaN(ingredient.quantity) ||
        Number(ingredient.quantity) < 0
      ) {
        validationErrors.push(
          `Ingredients ${index + 1}: Quantity is required.`
        );
      }
    });
  }

  // Validate packagings array
  if (!Array.isArray(formData.packagings) || formData.packagings.length === 0) {
    validationErrors.push("At least one Packaging and Labeling is required.");
  } else {
    formData.packagings.forEach((packaging, index) => {
      if (!packaging.id) {
        validationErrors.push(
          `Packaging and Labeling ${index + 1}: Product is required.`
        );
      }
      if (
        packaging.quantity === undefined ||
        packaging.quantity === null ||
        isNaN(packaging.quantity) ||
        Number(packaging.quantity) < 0
      ) {
        validationErrors.push(
          `Packaging and Labeling ${index + 1}: Quantity is required.`
        );
      }
    });
  }

  // Validate equipments
  formData.equipments.forEach((equipment, index) => {
    if (!equipment.id) {
      validationErrors.push(`Equipments ${index + 1}: Equipment is required.`);
    }
    if (
      equipment.amount === undefined ||
      equipment.amount === null ||
      isNaN(equipment.amount) ||
      Number(equipment.amount) < 0
    ) {
      validationErrors.push(`Equipments ${index + 1}: Amount is required.`);
    }
  });

  // Validate outputs array
  if (!Array.isArray(formData.outputs) || formData.outputs.length === 0) {
    validationErrors.push("At least one Output is required.");
  } else {
    formData.outputs.forEach((output, index) => {
      if (!output.outputType || output.outputType.trim() === "") {
        validationErrors.push(`Outputs ${index + 1}: Output Type is required.`);
      }
      if (!output.id) {
        validationErrors.push(
          `Outputs ${index + 1}: Product / Ingredient Type is required.`
        );
      }
      if (
        output.quantity === undefined ||
        output.quantity === null ||
        isNaN(output.quantity) ||
        Number(output.quantity) < 0
      ) {
        validationErrors.push(`Outputs ${index + 1}: Quantity is required.`);
      }
      if (
        output.unitPrice === undefined ||
        output.unitPrice === null ||
        isNaN(output.unitPrice) ||
        Number(output.unitPrice) < 0
      ) {
        validationErrors.push(`Outputs ${index + 1}: Unit Price is required.`);
      }
    });
  }

  return validationErrors;
};
