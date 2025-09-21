const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
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
    await user.save();
    res.send("User added");
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

module.exports = authRouter;
