// Validation.jsx

export const Validation = (formData) => {
  let validationErrors = [];

  // Validate processes and corresponding checks
  if (!formData.productCategory || formData.productCategory.trim() === "") {
    validationErrors.push("Product Category is required.");
  }

  // Return validation errors
  return validationErrors;
};
