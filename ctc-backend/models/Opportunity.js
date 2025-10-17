const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  type: { type: String },
  company: { type: String },
  location: { type: String },
  salary: { type: String },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Opportunity", OpportunitySchema);
