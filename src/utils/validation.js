const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  console.log("Validating edit profile data...");
  console.log("Request body:", req.body);

  // Check if req.body exists and is not null/undefined
  if (!req.body || typeof req.body !== "object") {
    console.log("Validation failed: req.body is missing or not an object");
    return false;
  }

  // Check if there are any fields to update
  const fieldsToUpdate = Object.keys(req.body);
  console.log("Fields to update:", fieldsToUpdate);

  if (fieldsToUpdate.length === 0) {
    console.log("Validation failed: No fields provided to update");
    return false;
  }

  // Check if all fields are allowed
  const isEditAllowed = fieldsToUpdate.every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    const invalidFields = fieldsToUpdate.filter(
      (field) => !allowedEditFields.includes(field)
    );
    console.log("Validation failed: Invalid fields found:", invalidFields);
    console.log("Allowed fields are:", allowedEditFields);
  } else {
    console.log("Validation passed: All fields are allowed");
  }

  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
