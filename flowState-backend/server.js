const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// Set up CORS to allow your frontend connection safely
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);

// Keep your existing Socket.io setup integrated here
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 📬 NODEMAILER SETUP
// Replace these placeholders with your actual Gmail and the 16-character App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    // 1. Enter your exact personal Gmail address here
    user: "novsjulien@gmail.com", 
    
    // 2. Paste the 16-character code you just copied from Google inside this string.
    // ⚠️ CRITICAL: DO NOT use your normal email password here! Use the App Password.
    pass: "jisj vlfd nepf bslg"
  }
});
// Interactive Email Endpoint
app.post("/api/send-dashboard-email", async (req, res) => {
  const { userEmail, messageText, userName } = req.body;

  if (!userEmail || !messageText) {
    return res.status(400).json({ success: false, message: "Missing required payload data." });
  }

  const mailOptions = {
    from: `"FlowState Studio" <YOUR_GMAIL_ADDRESS@gmail.com>`,
    to: userEmail, // Sends it right back to your authenticated email address
    subject: "📬 Live Dashboard Message Blast",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; background-color: #f8fafc; color: #0f172a;">
        <div style="max-width: 520px; margin: 0 auto; bg-color: #ffffff; background: #ffffff; padding: 24px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h2 style="color: #46a4fe; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 8px; tracking-tight: -0.025em;">Dashboard Ping!</h2>
          <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">Hey ${userName || "Developer"}, you triggered a manual notification request from your control panel. Here is your message text:</p>
          
          <div style="background-color: #f1f5f9; border-left: 4px solid #46a4fe; padding: 16px; border-radius: 12px; font-size: 13px; font-style: italic; color: #334155; margin-bottom: 20px; line-height: 1.5;">
            "${messageText}"
          </div>
          
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin-bottom: 16px;" />
          <p style="font-size: 10px; color: #94a3b8; margin-bottom: 0; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em;">Sent via Node.js SMTP Relay Engine</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("SMTP error encountered:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Socket logic room listeners go here...
io.on("connection", (socket) => {
  // Your room join/leave listeners...
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on connection pool http://localhost:${PORT}`);
});