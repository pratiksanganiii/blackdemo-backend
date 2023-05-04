const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config({ path: "config/.env" });
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const chatRouter = require("./routes/chatRoutes");
const { corsOpts } = require("./config/cors");

const PORT = process.env.PORT || 5000;

const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const { sendMessage } = require("./controllers/chatController");
const User = require("./model/User");
const io = new Server(server, { cors: corsOpts });

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (userId) {
    socket.userId = userId;
    next();
  } else {
    next(new Error("Not authorized."));
  }
});

io.on("connection", async function (socket) {
  let users = [];
  io.of("/").sockets.forEach(async (active) => {
    if (socket.userId !== active.userId) {
      const userObj = await User.findById(active.userId);
      if (userObj) {
        users.push({
          socketId: active.id,
          userId: active.userId,
          email: userObj.email,
        });
      }
    }
    users = [...new Set(users)];
    socket.emit("users", users);
  });

  // const userObj = socket.userId && (await User.findById(socket.userId));

  socket.broadcast.emit("userConnected", {
    userId: socket.userId,
    socketId: socket.id,
    email: (await User.findById(socket.userId)).email,
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("userDisconnected", {
      userId: socket.userId,
      socketId: socket.id,
    });
  });

  socket.on("chatMessageFromClient", async (payload) => {
    const message = await sendMessage({
      from: payload.from,
      to: payload.to,
      message: payload.message,
    });
    socket.to(payload.sendTo).emit("chatMessageFromServer", {
      message: message.message,
      userId: socket.userId,
    });
  });
});

connectDB();
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", (_req, res) => {
  res.json("Welcome to demo-black api.");
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
