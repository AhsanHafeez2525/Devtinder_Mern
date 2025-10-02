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

const validateChangePasswordData = (req) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be strong. It should contain at least 8 characters with uppercase, lowercase, number and symbol"
    );
  }
};

const validateForgotPasswordData = (req) => {
  const { emailId } = req.body;

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

const validateOTPData = (req) => {
  const { emailId, otp } = req.body;

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (!otp) {
    throw new Error("OTP is required");
  }

  if (!validator.isNumeric(otp) || otp.length !== 6) {
    throw new Error("OTP must be a 6-digit number");
  }
};

const validateGenerateOTPData = (req) => {
  const { emailId } = req.body;

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

const validateResendOTPData = (req) => {
  const { emailId } = req.body;

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateChangePasswordData,
  validateForgotPasswordData,
  validateOTPData,
  validateGenerateOTPData,
  validateResendOTPData,
};
