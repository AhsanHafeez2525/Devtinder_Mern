const socketio = require("socket.io");
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
        // handle events
        socket.on("join", ({firstName, lastName, userId, targetUserId}) => {
            const roomId= [userId, targetUserId].sort().join("_");
            console.log(firstName, lastName, "Joined room", roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", ({ firstName, lastName, userId, targetUserId, text }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(firstName, lastName, "Sent message", text);
            io.to(roomId).emit("receiveMessage", { firstName, lastName, text });
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