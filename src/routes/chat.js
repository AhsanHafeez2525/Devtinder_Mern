const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

chatRouter.get("/chat", userAuth, async (req, res) => {
    const { userId } = req.user;
    const chats = await Chat.find({ participants: userId });
    res.json(chats);
});

module.exports = chatRouter;