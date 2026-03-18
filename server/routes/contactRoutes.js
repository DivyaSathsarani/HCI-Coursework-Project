const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const { authMiddleware } = require("../middleware/auth");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =================================
   POST - Save contact message (public)
================================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const contact = new ContactMessage({ name, email, subject, message });
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      id: contact._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

/* =================================
   GET - Get all messages (admin, auth required)
================================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
});

/* =================================
   GET - Get single message by id (auth required)
================================= */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch message." });
  }
});

/* =================================
   PUT - Update message (auth required)
================================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const updateData = {};
    if (name != null) updateData.name = name;
    if (email != null) updateData.email = email;
    if (subject != null) updateData.subject = subject;
    if (message != null) updateData.message = message;

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message updated.", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update message." });
  }
});

/* =================================
   DELETE - Delete message (auth required)
================================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete message." });
  }
});

module.exports = router;
