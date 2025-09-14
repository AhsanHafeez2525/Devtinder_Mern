const express = require("express");

const userRouter = express.Router(); // name can be anything for better understanding
// const router = express.Router(); // In companies write like this and they are not mention authRouter
// router.post("/signup", async (req, res) => {
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
// the fromUserId, the user is already login, so fromUserId comes from login token, it's same like when i swap
// egt all the pending requests from the logged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]);
        if(!requests) {
            return res.status(404).json({ message: "No requests found" });
        }
        res.json({ requests });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({ $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }] }).populate("fromUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]);
        const data = connections.map((row) => row.fromUserId);
        res.json({ data });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = userRouter;
