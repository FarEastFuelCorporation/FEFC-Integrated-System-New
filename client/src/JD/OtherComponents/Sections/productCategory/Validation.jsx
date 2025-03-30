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

export const Validation2 = (formData) => {
  let validationErrors = [];

  // Validate processes and corresponding checks
  if (!formData.productName || formData.productName.trim() === "") {
    validationErrors.push("Product Name is required.");
  }
  if (!formData.productCategoryId) {
    validationErrors.push("Product Category is required.");
  }

  // Return validation errors
  return validationErrors;
};
