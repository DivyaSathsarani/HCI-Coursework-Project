const express = require("express");
const router = express.Router();

const RoomDesign = require("../models/RoomDesign");

// POST: Save Room
router.post("/save", async (req, res) => {
  try {
    console.log("POST /save received:", req.body);  // <-- logs the incoming data

    const room = new RoomDesign(req.body);
    const savedRoom = await room.save();

    console.log("Room saved in DB:", savedRoom);     // <-- logs what was actually saved
    res.json({ message: "Room saved", room: savedRoom });
  } catch (err) {
    console.error("Error saving room:", err);       // <-- logs any errors
    res.status(500).json(err);
  }
});

// GET: All Rooms
router.get("/all", async (req, res) => {
  try {
    const rooms = await RoomDesign.find();
    console.log("GET /all returned:", rooms);       // <-- logs all rooms
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json(err);
  }
});

module.exports = router;