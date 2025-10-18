const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET all users (protected, returns limited info)
router.get("/", auth, async (req, res) => {
  try {
    // Only return non-sensitive user information
    const users = await User.find().select("_id email full_name role");
    
    // Convert _id to id for consistency with frontend
    const usersWithId = users.map(user => ({
      id: user._id.toString(),
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }));
    
    res.json(usersWithId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single user by ID (protected)
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id email full_name role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: user._id.toString(),
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
