const mongoose = require("mongoose");

const FurnitureSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  model: { type: String, required: true },   // Path to .glb model
  image: { type: String },                   // Path to preview image
  size: { type: [Number], default: [1,1,1] },
  color: { type: String, default: "#888888" }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("Furniture", FurnitureSchema);