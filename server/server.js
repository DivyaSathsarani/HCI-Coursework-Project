require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const furnitureRoutes = require("./routes/furnitureRoutes");
const roomRoutes = require("./routes/roomRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");

const app = express();

/* ===============================
   CREATE UPLOADS FOLDER IF MISSING
================================ */
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Uploads folder created");
}

/* ===============================
   CORS - Allow both dev (5173) and prod (5001)
================================ */
const ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:5001"];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());

/* ===============================
   SERVE UPLOADED FILES
================================ */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/*
Now React can access files like:
http://localhost:5000/uploads/filename.glb
http://localhost:5000/uploads/image.png
*/

/* ===============================
   DATABASE CONNECTION + ADMIN SEED
================================ */
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/roomdesigner";
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Seed default admin user if it doesn't exist
    const adminEmail = "admin@example.com";
    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existing) {
      const hashed = await bcrypt.hash("123456", 10);
      await User.create({
        name: "Admin",
        email: adminEmail.toLowerCase(),
        password: hashed,
        provider: "email",
      });
      console.log("Seeded admin user (admin@example.com / 123456)");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("Tip: Start MongoDB locally or set MONGODB_URI in .env for MongoDB Atlas");
  });

/* ===============================
   ROUTES
================================ */
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    type: "health",
    ok: true,
    database: dbConnected ? "connected" : "disconnected",
    message: dbConnected ? "Server ready" : "Database not connected",
  });
});
// Debug: verify this server is the one receiving requests
app.get("/api/whoami", (req, res) => {
  res.json({ server: "furnish", pid: process.pid, ok: true });
});
app.use("/api/auth", authRoutes);
app.use("/api/furniture", furnitureRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/contact", contactRoutes);

// 404 for unmatched API routes (prevents SPA fallback from serving wrong response)
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `API route ${req.method} ${req.path} does not exist`,
  });
});

/* ===============================
   SERVE FRONTEND (same origin = no CORS)
================================ */
const frontendDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "An error occurred. Please try again." });
});

/* ===============================
   SERVER
================================ */
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});