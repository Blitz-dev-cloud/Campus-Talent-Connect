const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  full_name: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  skills: { type: [String] },
  role: { type: String },
});

module.exports = mongoose.model("Profile", ProfileSchema);
