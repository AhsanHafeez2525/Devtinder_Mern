const express = require("express");
const app = express();
const port = 3000;

// app.use("/ahsan", (req, res) => {
//   res.send("ahsan satti");
// });
// app.use("/react", (req, res) => {
//   res.send("Hello react");
// });
app.get("/user", (req, res) => {
  res.send({ firstName: "ahsan", lastName: "satti" });
});
app.post("/user", (req, res) => {
  res.send("data is save successfully into the database");
});
app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
