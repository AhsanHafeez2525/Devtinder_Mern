const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const port = 3000;

app.use(express.json());

// ✅ POST /signup - Create new user
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

// ✅ GET /user - Find user by email (pass emailId as query param)
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId; // Use query for GET
  try {
    // const user = await User.find({ emailId: userEmail });
    const user = await User.findOne({ emailId: userEmail });
    if (user.length == 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// ✅ Optional: GET /feed - Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Failed to fetch users: " + err.message);
  }
});
// ✅ Optional: GET /feed - Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Failed to fetch users: " + err.message);
  }
});
// ✅ Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({_id: userId})
    const user = await User.findByIdAndDelete(userId); // short cut
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Failed to fetch users: " + err.message);
  }
});

// patch - update data at the user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdatedAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("skills cannot be more than 10");
    }
    // await User.findByIdAndUpdate({_id: data})
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

// ✅ Start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
