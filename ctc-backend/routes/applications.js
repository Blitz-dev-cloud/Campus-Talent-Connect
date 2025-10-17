const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/auth");

// GET all applications (protected)
router.get("/", auth, async (req, res) => {
  try {
    let query = {};

    // If student, show only their applications
    if (req.user.role === "student") {
      query.student_id = req.user.id;
    }
    // If faculty/alumni, show applications for their opportunities
    else if (req.user.role === "faculty" || req.user.role === "alumni") {
      const myOpps = await Opportunity.find({ posted_by: req.user.id }).select(
        "_id"
      );
      const oppIds = myOpps.map((opp) => opp._id);
      query.opportunity = { $in: oppIds };
    }

    const apps = await Application.find(query)
      .populate("opportunity", "title company location")
      .populate("student_id", "email full_name")
      .sort({ created_at: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST application (protected)
router.post("/", auth, async (req, res) => {
  const {
    opportunity,
    cover_letter,
    resume_base64,
    resume_name,
    cgpa,
    tenth_percentage,
    twelfth_percentage,
  } = req.body;

  try {
    const opp = await Opportunity.findById(opportunity);
    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const existing = await Application.findOne({
      opportunity,
      student_id: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Already applied to this opportunity" });
    }

    const app = await Application.create({
      opportunity,
      opportunity_title: opp.title,
      student_id: req.user.id,
      cover_letter,
      resume_base64,
      resume_name,
      cgpa,
      tenth_percentage,
      twelfth_percentage,
    });

    const populatedApp = await Application.findById(app._id)
      .populate("opportunity", "title company location")
      .populate("student_id", "email full_name");

    res.status(201).json(populatedApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my applications (protected)
router.get("/my-applications", auth, async (req, res) => {
  try {
    const apps = await Application.find({ student_id: req.user.id })
      .populate("opportunity", "title company location")
      .sort({ created_at: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single application (protected)
router.get("/:id", auth, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("opportunity", "title company location salary type description")
      .populate("student_id", "email full_name");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization
    const isStudent = app.student_id._id.toString() === req.user.id;
    const opp = await Opportunity.findById(app.opportunity._id);
    const isOwner = opp && opp.posted_by.toString() === req.user.id;

    if (!isStudent && !isOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update application status (protected)
router.patch("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify user owns the opportunity
    const opp = await Opportunity.findById(app.opportunity);
    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opp.posted_by.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    app.status = status;
    await app.save();

    const updatedApp = await Application.findById(app._id)
      .populate("opportunity", "title company location")
      .populate("student_id", "email full_name");

    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE application (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only student who created it can delete
    if (app.student_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
