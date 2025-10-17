const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "alumni"],
    default: "student",
  },
  full_name: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
