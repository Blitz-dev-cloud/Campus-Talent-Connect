const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Application = require("../models/Application");
const auth = require("../middleware/auth");

// GET messages for a specific application (protected)
router.get("/:applicationId", auth, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Verify user has access to this application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is either the student or the opportunity poster
    const opportunity = await application.populate("opportunity");
    const isStudent = application.student_id.toString() === req.user.id;
    const isFacultyOrAlumni =
      opportunity.opportunity.posted_by.toString() === req.user.id;

    if (!isStudent && !isFacultyOrAlumni) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all messages for this application
    const messages = await Message.find({ application_id: applicationId })
      .populate("sender_id", "full_name email role")
      .populate("receiver_id", "full_name email role")
      .sort({ created_at: 1 });

    // Manually fetch profile pictures for sender and receiver
    const Profile = require("../models/Profile");
    const messagesWithProfiles = await Promise.all(
      messages.map(async (msg) => {
        const senderProfile = await Profile.findOne({
          user_id: msg.sender_id._id,
        });
        const receiverProfile = await Profile.findOne({
          user_id: msg.receiver_id._id,
        });

        return {
          ...msg.toObject(),
          sender_id: {
            ...msg.sender_id.toObject(),
            profile_picture: senderProfile?.profile_picture || null,
          },
          receiver_id: {
            ...msg.receiver_id.toObject(),
            profile_picture: receiverProfile?.profile_picture || null,
          },
        };
      })
    );

    res.json(messagesWithProfiles);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST new message (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { application_id, receiver_id, message } = req.body;

    if (!application_id || !receiver_id || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify application exists
    const application = await Application.findById(application_id).populate(
      "opportunity"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify user has access
    const isStudent = application.student_id.toString() === req.user.id;
    const isFacultyOrAlumni =
      application.opportunity.posted_by.toString() === req.user.id;

    if (!isStudent && !isFacultyOrAlumni) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newMessage = await Message.create({
      application_id,
      sender_id: req.user.id,
      receiver_id,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender_id", "full_name email role")
      .populate("receiver_id", "full_name email role");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("Post message error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark message as read (protected)
router.patch("/:messageId/read", auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only the receiver can mark as read
    if (message.receiver_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET unread message count (protected)
router.get("/unread/count", auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver_id: req.user.id,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
