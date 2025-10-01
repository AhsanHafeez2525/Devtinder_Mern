const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("./utils/cronjob");

dotenv.config();

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Content-Type:", req.headers["content-type"]);
  next();
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
