const express = require("express");
const { validateSignUpData, validateForgotPasswordData, validateOTPData, validateGenerateOTPData, validateChangePasswordData, validateResendOTPData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendOTPEmail, sendPasswordResetEmail } = require("../utils/emailService");
const authRouter = express.Router(); // name can be anything for better understanding
// const router = express.Router(); // In companies write like this and they are not mention authRouter
// router.post("/signup", async (req, res) => {

authRouter.post("/signup", async (req, res) => {
  try {
    // validate of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
 const savedUser =   await user.save();
 const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // after 8 hours expire
    });
    res.json({message: "User added", data: savedUser});
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      // throw new Error("Email ID is not present in DB");
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a jw token

      const token = await user.getJWT();
      // console.log(token);
      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // after 8 hours expire
      });
      res.send(user);
    } else {
      // throw new Error("Password is not correct");
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("login error " + err.message);
  }
});

// you can use try catch
// logout just remove the cookie
// in big websites like tender or fb might be add more logic on logout like clean db etc but generally use like this
authRouter.post("/logout", async (req, res) => {
  // Clear the cookie
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

// Generate OTP API
authRouter.post("/forgot-password", async (req, res) => {
  try {
    // Validate email data
    validateGenerateOTPData(req);

    const { emailId } = req.body;

    // Check if user exists
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.json({ 
        message: "If the email exists in our system, you will receive an OTP." 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiration (1 minute from now)
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    
    await user.save();

    // Send OTP via email
    const emailResult = await sendOTPEmail(emailId, otp);
    
    if (emailResult.success) {
      console.log(`OTP sent successfully to ${emailId}`);
      res.json({ 
        message: "If the email exists in our system, you will receive an OTP."
      });
    } else {
      console.error(`Failed to send OTP email to ${emailId}:`, emailResult.error);
      // Still return success to user for security (don't reveal email sending failure)
      res.json({ 
        message: "If the email exists in our system, you will receive an OTP."
      });
    }

  } catch (err) {
    res.status(400).json({ error: "Generate OTP error: " + err.message });
  }
});

// Verify OTP API
authRouter.post("/verify-otp", async (req, res) => {
  try {
    // Validate OTP data
    validateOTPData(req);

    const { emailId, otp } = req.body;

    // Find user and check if OTP exists and is not expired
    const user = await User.findOne({ 
      emailId: emailId,
      otp: otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: "Invalid or expired OTP" 
      });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ 
      message: "OTP verified successfully",
      data: { emailId: user.emailId }
    });

  } catch (err) {
    res.status(400).json({ error: "Verify OTP error: " + err.message });
  }
});

// Resend OTP API
authRouter.post("/resend-otp", async (req, res) => {
  try {
    // Validate email data
    validateResendOTPData(req);

    const { emailId } = req.body;

    // Check if user exists
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.json({ 
        message: "If the email exists in our system, you will receive an OTP." 
      });
    }

    // Check if there's already a valid OTP (not expired)
    if (user.otp && user.otpExpires && user.otpExpires > new Date()) {
      return res.status(429).json({ 
        error: "Please wait before requesting another OTP. You can request a new OTP after the current one expires." 
      });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiration (1 minute from now)
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    
    await user.save();

    // Send OTP via email
    const emailResult = await sendOTPEmail(emailId, otp);
    
    if (emailResult.success) {
      console.log(`OTP resent successfully to ${emailId}`);
      res.json({ 
        message: "If the email exists in our system, you will receive an OTP."
      });
    } else {
      console.error(`Failed to resend OTP email to ${emailId}:`, emailResult.error);
      // Still return success to user for security (don't reveal email sending failure)
      res.json({ 
        message: "If the email exists in our system, you will receive an OTP."
      });
    }

  } catch (err) {
    res.status(400).json({ error: "Resend OTP error: " + err.message });
  }
});

// Change Password API
authRouter.post("/change-password", userAuth, async (req, res) => {
  try {
    // Validate change password data
    validateChangePasswordData(req);

    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = newPasswordHash;
    await user.save();

    res.json({ 
      message: "Password changed successfully" 
    });

  } catch (err) {
    res.status(400).json({ error: "Change password error: " + err.message });
  }
});

module.exports = authRouter;
