const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const furnitureRoutes = require("./routes/furnitureRoutes");
const roomRoutes = require("./routes/roomRoutes");

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
   MIDDLEWARE
================================ */
app.use(cors());
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
   DATABASE CONNECTION
================================ */
mongoose
  .connect("mongodb://127.0.0.1:27017/roomdesigner")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ===============================
   ROUTES
================================ */
app.use("/api/furniture", furnitureRoutes);
app.use("/api/rooms", roomRoutes);

/* ===============================
   SERVER
================================ */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});