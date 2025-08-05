// const express = require("express");
// const connectDB = require("./config/database");
// const app = express();
// const User = require("./models/user");
// const port = 3000;
// app.use(express.json());
// app.post("/signup", async (req, res) => {
//   console.log(req.body);
//   const user = new User(req.body);
//   try {
//     await user.save();
//     res.send("User added");
//   } catch (err) {
//     res.status(400).send("Error saving the user" + err.message);
//   }

//   // get user by email

//   app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;
//     try {
//       const user = await User.find({ emailId: userEmail });
//       res.send(user);
//     } catch (err) {
//       res.status(400).send("something went wrong");
//     }
//   });

//   // Feed API - GET /feed - get all the users from the database

//   // app.get("/feed", (req, res) => {});
// });

// connectDB()
//   .then(() => {
//     console.log("database connected successfully");
//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log("database cannot be connected");
//   });

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
