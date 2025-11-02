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

// GET current user's profile (protected)
router.get("/me", auth, async (req, res) => {
  try {
    console.log("=== GET /api/profiles/me ===");
    console.log("Authenticated user ID from token:", req.user.id);
    console.log("Full user object from token:", req.user);
    
    const profile = await Profile.findOne({ user_id: req.user.id }).populate(
      "user_id",
      "email full_name role"
    );
    
    console.log("Profile found:", profile ? "YES" : "NO");
    if (profile) {
      console.log("Profile._id:", profile._id);
      console.log("Profile.user_id:", profile.user_id);
    }
    
    // Also check if there's a profile with a string version of the ID
    if (!profile) {
      console.log("Trying to find profile with different ID format...");
      const allProfiles = await Profile.find();
      console.log("Total profiles in DB:", allProfiles.length);
      console.log("All user_ids in DB:", allProfiles.map(p => ({ id: p.user_id, type: typeof p.user_id })));
    }
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("GET /me error:", err);
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
    console.log("=== POST /api/profiles (CREATE) ===");
    console.log("Creating profile with body:", req.body);
    console.log("User from auth token:", req.user);
    console.log("req.body.user_id:", req.body.user_id, "Type:", typeof req.body.user_id);
    console.log("req.user.id:", req.user.id, "Type:", typeof req.user.id);

    const userIdToUse = req.body.user_id || req.user.id;
    console.log("Will use user_id:", userIdToUse, "Type:", typeof userIdToUse);

    const existingProfile = await Profile.findOne({
      user_id: userIdToUse,
    });
    if (existingProfile) {
      console.log("Profile already exists:", existingProfile);
      return res
        .status(400)
        .json({ message: "Profile already exists for this user" });
    }

    const profile = await Profile.create({
      ...req.body,
      user_id: userIdToUse,
    });
    console.log("Profile created successfully!");
    console.log("Created profile._id:", profile._id);
    console.log("Created profile.user_id:", profile.user_id, "Type:", typeof profile.user_id);
    res.status(201).json(profile);
  } catch (err) {
    console.error("Profile creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update profile (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    console.log("=== PUT /api/profiles/:id (UPDATE) ===");
    console.log("Profile ID to update:", req.params.id);
    console.log("User from auth token:", req.user.id);
    
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      console.log("Profile not found for ID:", req.params.id);
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log("Found profile.user_id:", profile.user_id, "Type:", typeof profile.user_id);
    console.log("Comparing with req.user.id:", req.user.id, "Type:", typeof req.user.id);

    // Check if user owns this profile
    if (profile.user_id.toString() !== req.user.id) {
      console.log("Authorization failed - user doesn't own this profile");
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("Updating profile with data:", req.body);
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log("Profile updated successfully!");

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
