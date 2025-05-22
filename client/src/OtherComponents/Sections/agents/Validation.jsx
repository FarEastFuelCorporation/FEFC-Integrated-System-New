// validateAgentForm.js

export const validateAgentForm = (formData) => {
  const errors = [];

  // Required text fields
  if (!formData.firstName || formData.firstName.trim() === "") {
    errors.push("First Name is required.");
  }

  if (!formData.middleName || formData.middleName.trim() === "") {
    errors.push("Middle Name is required.");
  }

  if (!formData.lastName || formData.lastName.trim() === "") {
    errors.push("Last Name is required.");
  }

  if (!formData.gender || formData.gender.trim() === "") {
    errors.push("Gender is required.");
  }

  if (!formData.civilStatus || formData.civilStatus.trim() === "") {
    errors.push("Civil Status is required.");
  }

  if (!formData.birthDate || formData.birthDate.trim() === "") {
    errors.push("Birth Date is required.");
  }

  if (!formData.mobileNo || formData.mobileNo.trim() === "") {
    errors.push("Mobile No. is required.");
  }

  if (!formData.emailAddress || formData.emailAddress.trim() === "") {
    errors.push("Email Address is required.");
  } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
    errors.push("Email Address is invalid.");
  }

  if (!formData.permanentAddress || formData.permanentAddress.trim() === "") {
    errors.push("Address is required.");
  }

  if (!formData.createdBy || formData.createdBy.trim() === "") {
    errors.push("Created By is required.");
  }

  return errors;
};
