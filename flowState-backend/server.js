const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

// Accept connections from any local port during development
app.use(cors({
  origin: [/localhost:\d+$/],
  methods: ["GET", "POST"]
}));
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [/localhost:\d+$/],
    methods: ["GET", "POST"]
  }
});

app.get('/api/community/posts', (req, res) => {
  res.json({ message: "V2 Server active and clear!" });
});

io.on("connection", (socket) => {
  console.log(`📡 User joined V2 gateway: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`🚪 User entered space: ${data.room}`);
  });

  socket.on("send_message", (data) => {
    // Broadcast message strictly to the other user
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data.room);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = 5000; // Fresh port to avoid conflicts!
httpServer.listen(PORT, () => {
  console.log(`🚀 V2 Server engine running on http://localhost:${PORT}`);
});