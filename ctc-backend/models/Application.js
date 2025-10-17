const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
  opportunity_title: { type: String },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cover_letter: { type: String },
  resume_base64: { type: String },
  resume_name: { type: String },
  cgpa: { type: Number },
  tenth_percentage: { type: Number },
  twelfth_percentage: { type: Number },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);
