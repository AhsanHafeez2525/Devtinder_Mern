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
        res.json({data: requests });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({ 
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
            status: "accepted"
        }).populate("fromUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]).populate("toUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]);
        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
               return  row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // User should see all the users cards except
        // 0. hiw own card
        // 1. his connections
        // 2. ignored people
        // 3. already sent the connection request

        // Example: Rahul=[Akshay, Elon, Musk, Ronald, Donald, MS Dhoni, Virat]
        // R -> Akshary -> rejected  R-> Elon -> accepted

        const loggedInUser = req.user;
        // add pagination from 1 to 10

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        const connectionRequests = await ConnectionRequest.find({ $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }] }).select("fromUserId toUserId");
        
        // .populate("fromUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]).populate("toUserId",["firstName","lastName", "photoUrl", "age", "gender", "about", "skills"]);

        const hideUsersfromFeed = new Set();             // always enter unique values in an array

        connectionRequests.forEach((row) => {
            hideUsersfromFeed.add(row.fromUserId.toString());
            hideUsersfromFeed.add(row.toUserId.toString());
        });
console.log(hideUsersfromFeed)
const users = await User.find({ 
    _id: { 
        $nin: Array.from(hideUsersfromFeed).concat([loggedInUser._id])
    } 
}).select("firstName lastName photoUrl age gender about skills").skip(skip).limit(limit);
        res.json({ data: users });     // use this always beacuse it make standard
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});
module.exports = userRouter;
