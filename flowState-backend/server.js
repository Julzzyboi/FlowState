const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

// 1. Initialize Express App Instance
const app = express();

// 2. Configure Permissive Localhost CORS Strategy (Handles REST endpoints)
app.use(cors({
  origin: [/localhost:\d+$/], // Dynamic regex ruleset matching any local port node
  methods: ["GET", "POST"]
}));
app.use(express.json()); // Body-parser allocation for standard JSON payloads

// 3. Create the Base Native HTTP Server 
const httpServer = createServer(app);

// 4. Instantiate Socket.io Attached to HTTP Instance with Shared CORS Ruleset
const io = new Server(httpServer, {
  cors: {
    origin: [/localhost:\d+$/], // Dynamic regex ruleset matching any local port node
    methods: ["GET", "POST"]
  }
});

// ==========================================
// REST ENDPOINT ROUTER MAP
// ==========================================
app.get('/api/community/posts', async (req, res) => {
  try {
    // Structural wrapper ready for Firestore/DB pulling procedures
    res.json({ message: "Posts endpoint is fully operational!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SOCKET.IO REAL-TIME EVENT PIPELINE
// ==========================================
io.on("connection", (socket) => {
  console.log(`📡 User connected to gateway: ${socket.id}`);

  // Channel Gateway Entry Routing
  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`🚪 User ${socket.id} entered space node: ${data.room}`);
  });

  // Message Broadcast Pipeline Relay Vector
  socket.on("send_message", (data) => {
    // Broadcast the payload strictly to other instances occupying the exact same room
    socket.to(data.room).emit("receive_message", data);
  });

  // Channel Gateway Exit Routing
  socket.on("leave_room", (data) => {
    socket.leave(data.room);
    console.log(`🚪 User ${socket.id} abandoned space node: ${data.room}`);
  });

  // Client Termination Event Hook
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected from gateway: ${socket.id}`);
  });
});

// ==========================================
// SERVER INITIALIZATION EXECUTION NODE
// ==========================================
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Unified Server engine deployed at http://localhost:${PORT}`);
});