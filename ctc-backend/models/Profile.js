const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  full_name: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  skills: { type: [String] },
  role: { type: String },
  profile_picture: { type: String }, // URL or base64 string
});

module.exports = mongoose.model("Profile", ProfileSchema);
