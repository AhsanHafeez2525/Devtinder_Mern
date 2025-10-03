const socketio = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}
const initializeSocket = (server) => {
    const io = socketio(server,{
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:5173", 
          "http://localhost:5174", 
          "https://devtender.netlify.app"
        ],
        credentials: true,
      },
    });
    io.on("connection", (socket) => {
        // Handle authentication
        const token = socket.handshake.auth.token;
        console.log("Client connected with token:", token);
        
        // handle events
        socket.on("join", ({firstName, lastName, userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName, lastName, "Joined room", roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName, lastName, "Sent message", text);

            /// save message to database
           try {
            let chat = await Chat.findOne({
                participants: {$all: [userId, targetUserId]},

            });
            if(!chat) {
                chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: [],
                });
            }
            chat.messages.push({senderId: userId, text: text});
            io.to(roomId).emit("receiveMessage", { firstName, lastName, text });
            await chat.save();
           } catch (error) {
            console.error("Error saving message:", error);
           }
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
      console.log("New client connected");
    });
};

module.exports = {
  initializeSocket
};