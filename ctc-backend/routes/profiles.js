const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");

// GET all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "user_id",
      "email full_name role"
    );
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET profile by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create profile (protected)
router.post("/", auth, async (req, res) => {
  try {
    console.log("Creating profile with body:", req.body);
    console.log("User from auth:", req.user);

    const existingProfile = await Profile.findOne({
      user_id: req.body.user_id,
    });
    if (existingProfile) {
      console.log("Profile already exists:", existingProfile);
      return res
        .status(400)
        .json({ message: "Profile already exists for this user" });
    }

    const profile = await Profile.create({
      ...req.body,
      user_id: req.body.user_id || req.user.id,
    });
    console.log("Profile created successfully:", profile);
    res.status(201).json(profile);
  } catch (err) {
    console.error("Profile creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update profile (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if user owns this profile
    if (profile.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE profile (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if user owns this profile
    if (profile.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
