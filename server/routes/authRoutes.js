const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware, ADMIN_USER, CUSTOMER_USER } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "furnish-dev-secret-change-in-production";

const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is not connected. Please start MongoDB or check MONGODB_URI in .env",
    });
  }
  next();
};

router.post("/signup", ensureDbConnected, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name || "",
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: "email",
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  console.log("🔥 LOGIN ROUTE HIT", req.method, req.path);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const demoUsers = [
      { id: "admin-user", email: "admin@example.com", name: "Admin", password: "123456" },
      { id: "admin-user", email: "admin@gmail.com", name: "Admin", password: "12345678" },
      { id: "customer-user", email: "test@gmail.com", name: "Customer", password: "20030805" },
    ];
    const demo = demoUsers.find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );
    if (demo) {
      const user = { id: demo.id, email: demo.email, name: demo.name };
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ ok: true, success: true, token, user });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    if (!dbConnected) {
      return res.status(503).json({
        message: "Database not connected. Please start MongoDB.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    if (!user.password) {
      return res.status(400).json({ message: "This account uses social login. Please sign in with Google or Facebook." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      ok: true,
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed." });
  }
});

router.post("/social", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    const demoEmails = ["google.user@example.com", "facebook.user@example.com"];
    if (!dbConnected && demoEmails.includes(email.toLowerCase())) {
      const demoUser = { id: "social-demo", email, name: name || "Demo User" };
      const token = jwt.sign({ userId: demoUser.id }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ success: true, token, user: demoUser });
    }

    if (!dbConnected) {
      return res.status(503).json({
        message: "Database not connected. Please start MongoDB.",
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        name: name || "",
        email: email.toLowerCase(),
        password: "",
        provider: "google",
      });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Social login failed." });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (req.userId === ADMIN_USER.id) return res.json({ user: ADMIN_USER });
    if (req.userId === CUSTOMER_USER.id) return res.json({ user: CUSTOMER_USER });
    if (req.userId === "social-demo") {
      return res.json({ user: { id: "social-demo", email: "google.user@example.com", name: "Demo User" } });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected." });
    }
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

module.exports = router;
