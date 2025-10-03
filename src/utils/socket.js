const socketio = require("socket.io");
const initializeSocket = (server) => {
    const io = socketio(server,{
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });
    io.on("connection", (socket) => {
      console.log("New client connected");
    });
};

module.exports = {
  initializeSocket
};