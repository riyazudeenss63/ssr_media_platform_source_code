const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Initialize Database connection (falls back cleanly to in-memory store if offline)
connectDB();

app.use(express.json());
app.use(cors());

// Static uploads serving
const uploadsDir = path.join(__dirname, "../uploads");
fs.mkdirSync(path.join(uploadsDir, "thumbnails"), { recursive: true });
fs.mkdirSync(path.join(uploadsDir, "videos"), { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Support both /api/* and root /auth, /users, /videos, /analytics, /admin
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/videos", videoRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/admin", adminRoutes);

// Serve frontend static build
const frontendBuild = path.join(__dirname, "../../frontend/build");
app.use(express.static(frontendBuild));

// SPA fallback
app.get("*", (req, res) => {
  const indexHtml = path.join(frontendBuild, "index.html");
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.send("Smart OTT Analytics Server Running - Frontend build not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: err.message || "Internal server error" });
});

module.exports = app;
