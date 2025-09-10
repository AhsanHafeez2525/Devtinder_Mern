const express = require("express");

const requestRouter = express.Router(); // name can be anything for better understanding
// const router = express.Router(); // In companies write like this and they are not mention authRouter
// router.post("/signup", async (req, res) => {
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
// the fromUserId, the user is already login, so fromUserId comes from login token, it's same like when i swap left in tender in network tab is show recieverid
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const connectionRequestData = await connectionRequest.save();
      res.json({
        message: "Connection request send Successfully",
        connectionRequestData,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestRouter;
