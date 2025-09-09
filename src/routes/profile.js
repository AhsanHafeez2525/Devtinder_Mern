const express = require("express");
const {
  validateEditProfileData,
  validateChangePasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router(); // name can be anything for better understanding
// const router = express.Router(); // In companies write like this and they are not mention authRouter
// router.post("/signup", async (req, res) => {
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: the token is not valid " + err.message);
  }
});

// Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);
    console.log("Request body type:", typeof req.body);

    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        error:
          "Request body is missing. Make sure you're sending JSON data with Content-Type: application/json header",
      });
    }

    console.log("Request body keys:", Object.keys(req.body));

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    console.log("User logged in =>", loggedInUser);

    // Update the user with the provided fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    console.log("User logged in after update =>", loggedInUser);

    // Save the updated user to database
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    console.error("Profile edit error:", err.message);
    res.status(400).send("Error updating profile: " + err.message);
  }
});

// Change password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    console.log("Password change request received");
    console.log("Request body:", req.body);

    // Validate the request data
    validateChangePasswordData(req);

    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    // Verify current password
    const isCurrentPasswordValid = await loggedInUser.validatePassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    loggedInUser.password = hashedNewPassword;
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your password has been updated successfully!`,
    });
  } catch (err) {
    console.error("Password change error:", err.message);
    res.status(400).json({
      error: "Error changing password: " + err.message,
    });
  }
});

module.exports = profileRouter;
