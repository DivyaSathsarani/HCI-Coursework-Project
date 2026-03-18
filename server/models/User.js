const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    provider: { type: String, default: "email" },
    providerId: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
