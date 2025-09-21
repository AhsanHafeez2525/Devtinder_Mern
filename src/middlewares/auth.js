const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Please login" });
    }

    // Validate the token
    const decodedObj = await jwt.verify(token, "DEV@Ahsan$25256100");
    const { _id } = decodedObj;

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to request so routes can use it
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = {
  userAuth,
};
