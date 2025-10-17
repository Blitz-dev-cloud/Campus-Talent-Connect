require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Import models
const User = require("../models/User");
const Profile = require("../models/Profile");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected for seeding");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

(async () => {
  try {
    await connectDB();

    // Load seed data from JSON file
    const raw = fs.readFileSync(path.join(__dirname, "db.json"), "utf8");
    const data = JSON.parse(raw);

    // Clear existing collections
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});

    // Map old IDs to new MongoDB _id
    const userMap = {};
    const oppMap = {};

    // 1️⃣ Seed Users
    for (const u of data.users) {
      const password = u.password || "changeme";
      const hash = await bcrypt.hash(password, 10);

      const userDoc = new User({
        email: u.email,
        password: hash,
        role: u.role || "student",
        full_name: u.full_name || "",
      });

      await userDoc.save();
      userMap[u.id] = userDoc;
    }

    // 2️⃣ Seed Profiles
    for (const p of data.profiles) {
      const userRef = userMap[p.user_id];
      const profileDoc = new Profile({
        user_id: userRef ? userRef._id : null,
        full_name: p.full_name || (userRef ? userRef.full_name : ""),
        bio: p.bio || "",
        phone: p.phone || "",
        location: p.location || "",
        skills: p.skills || [],
        role: p.role || "",
      });
      await profileDoc.save();
    }

    // 3️⃣ Seed Opportunities
    for (const o of data.opportunities) {
      const postedByUser = userMap[o.posted_by];
      const oppDoc = new Opportunity({
        title: o.title,
        description: o.description,
        type: o.type,
        company: o.company,
        location: o.location,
        salary: o.salary,
        posted_by: postedByUser ? postedByUser._id : null,
        created_at: o.created_at ? new Date(o.created_at) : undefined,
      });
      await oppDoc.save();
      oppMap[o.id] = oppDoc;
    }

    // 4️⃣ Seed Applications
    for (const a of data.applications) {
      const oppDoc = oppMap[a.opportunity];
      const studentUser = userMap[a.student_id];
      const appDoc = new Application({
        opportunity: oppDoc ? oppDoc._id : null,
        opportunity_title: a.opportunity_title,
        student_id: studentUser ? studentUser._id : null,
        cover_letter: a.cover_letter || "",
        resume_base64: a.resume_base64 || "",
        resume_name: a.resume_name || "",
        status: a.status || "pending",
        created_at: a.created_at ? new Date(a.created_at) : undefined,
      });
      await appDoc.save();
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
})();
