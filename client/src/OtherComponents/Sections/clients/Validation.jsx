export const validateClientForm = (data) => {
  const errors = [];

  // MOA Date
  if (data.moaDate && isNaN(new Date(data.moaDate).getTime())) {
    errors.push("MOA Date is invalid.");
  }

  if (data.moaEndDate && isNaN(new Date(data.moaEndDate).getTime())) {
    errors.push("MOA End Date is invalid.");
  }

  // Certification Details
  if (!data.clientName || data.clientName.trim() === "") {
    errors.push("Client Name is required.");
  }

  if (!data.address || data.address.trim() === "") {
    errors.push("Address is required.");
  }

  // Contact Number: Optional but must be digits if provided
  if (data.contactNumber && !/^\d{7,15}$/.test(data.contactNumber.trim())) {
    errors.push("Contact Number must be 7-15 digits.");
  }

  if (!data.clientType || data.clientType.trim() === "") {
    errors.push("Client Type is required.");
  }

  // Email: Optional but must be valid format if provided
  if (data.email) {
    const emails = data.email.split(",").map((email) => email.trim());
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const invalidEmails = emails.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      errors.push(`Invalid email format for: ${invalidEmails.join(", ")}`);
    }
  }

  // Billing Details
  if (!data.billerName || data.billerName.trim() === "") {
    errors.push("Biller Name is required.");
  }

  if (!data.billerAddress || data.billerAddress.trim() === "") {
    errors.push("Biller Address is required.");
  }

  // Contact Person: Optional
  if (
    data.billerContactPerson &&
    !/^[a-zA-Z\s.'\-&,()]{2,}$/.test(data.billerContactPerson.trim())
  ) {
    errors.push(
      "Biller Contact Person must contain only letters and valid special characters (e.g., . ' - & , ())."
    );
  }

  // Biller Contact Number: Optional but must be digits if provided
  if (
    data.billerContactNumber &&
    !/^\d{7,15}$/.test(data.billerContactNumber.trim())
  ) {
    errors.push("Biller Contact Number must be 7-15 digits.");
  }

  // Nature of Business: Optional but should be string
  if (
    data.natureOfBusiness &&
    !/^[a-zA-Z\s.,'-]+$/.test(data.natureOfBusiness.trim())
  ) {
    errors.push("Nature of Business must be a valid string.");
  }

  // Biller TIN Number: Optional but must be numeric if provided
  if (
    data.billerTinNumber &&
    !/^(\d{3}-\d{3}-\d{3}-\d{3}|\d{3}-\d{3}-\d{3}-\d{5})$/.test(
      data.billerTinNumber.trim()
    )
  ) {
    errors.push(
      "Biller TIN Number must be in the format XXX-XXX-XXX-XXX or XXX-XXX-XXX-XXXXX."
    );
  }

  // Client Activity Status: Required
  if (!data.clientActivityStatus || data.clientActivityStatus.trim() === "") {
    errors.push("Client Activity Status is required.");
  }

  // Client Transaction Status: Required
  if (
    !data.clientTransactionStatus ||
    data.clientTransactionStatus.trim() === ""
  ) {
    errors.push("Client Transaction Status is required.");
  }

  return errors;
};
