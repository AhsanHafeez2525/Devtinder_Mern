const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const port = 3000;
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
  // creating a new instance of the user modal
  // const user = new User({
  //   firstName: "sayyam",
  //   lastName: "satti",
  //   emailId: "sayyamsatti@gmail.com",
  //   password: "sayyam123",
  // });
  // try {
  //   await user.save();
  //   res.send("User added");
  // } catch (err) {
  //   res.status(400).send("Error saving the user" + err.message);
  // }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });

// app.use("/ahsan", (req, res) => {
//   res.send("ahsan satti");
// });
// app.use("/react", (req, res) => {
//   res.send("Hello react");
// });
// app.get("/user", (req, res) => {
//   res.send({ firstName: "ahsan", lastName: "satti" });
// });
// app.post("/user", (req, res) => {
//   res.send("data is save successfully into the database");
// });
// app.use("/", (req, res) => {
//   res.send("Hello World!");
// });

// middlware and route handler

// app.use("/user", (req, res) => {
// route handler
// res.send("Route handler 1");
// console.log("call Route handler 1");
// });

// multiple route handlers

// app.use(
//   "/user",
//   (req, res, next) => {
//     // route handler
//     res.send("Route handler 1");
//     console.log("call Route handler 1");
//     next();
//   },
// middlewares
//   (req, res) => {
//     // route handler 2
//     res.send("Route handler 2");
//     console.log("call Route handler 2");
//   }
// );

app.get("/user", (req, res, next) => {
  // route handler
  // res.send("Route handler 1");
  console.log("call Route handler 1");
  next();
});
app.get("/user", (req, res, next) => {
  // route handler
  res.send("Route handler 1");
  console.log("call Route handler 1");
  next();
});
