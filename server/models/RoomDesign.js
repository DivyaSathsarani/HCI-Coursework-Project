const mongoose = require("mongoose");

const RoomDesignSchema = new mongoose.Schema({
  name: String,
  roomSize: Number,
  walls: Array,
  furniture: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("RoomDesign", RoomDesignSchema);