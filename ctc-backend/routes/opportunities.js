const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/auth");

// GET all opportunities
router.get("/", async (req, res) => {
  try {
    const opps = await Opportunity.find()
      .populate("posted_by", "email full_name")
      .sort({ created_at: -1 });
    res.json(opps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my opportunities (protected)
router.get("/my-opportunities", auth, async (req, res) => {
  try {
    const opps = await Opportunity.find({ posted_by: req.user.id }).sort({
      created_at: -1,
    });
    res.json(opps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single opportunity
router.get("/:id", async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate(
      "posted_by",
      "email full_name"
    );
    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res.json(opp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new opportunity (protected)
router.post("/", auth, async (req, res) => {
  try {
    const opp = await Opportunity.create({
      ...req.body,
      posted_by: req.user.id,
    });
    res.status(201).json(opp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update opportunity (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user owns this opportunity
    if (opp.posted_by.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedOpp = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedOpp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE opportunity (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user owns this opportunity
    if (opp.posted_by.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: "Opportunity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
