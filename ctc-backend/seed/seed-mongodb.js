require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create users
    const student = await User.create({
      email: "student@test.com",
      password: hashedPassword,
      role: "student",
      full_name: "John Student",
    });

    const alumni = await User.create({
      email: "alumni@test.com",
      password: hashedPassword,
      role: "alumni",
      full_name: "Jane Alumni",
    });

    const faculty = await User.create({
      email: "faculty@test.com",
      password: hashedPassword,
      role: "faculty",
      full_name: "Dr. Smith",
    });

    console.log("✅ Users created");

    // Create profiles
    await Profile.create({
      user_id: student._id,
      full_name: "John Student",
      bio: "Computer Science student passionate about AI",
      phone: "+1234567890",
      location: "New York, NY",
      skills: ["Python", "JavaScript", "React", "Machine Learning"],
      role: "student",
    });

    await Profile.create({
      user_id: alumni._id,
      full_name: "Jane Alumni",
      bio: "Software Engineer at Tech Corp",
      phone: "+1234567891",
      location: "San Francisco, CA",
      skills: ["Java", "Spring", "AWS", "Microservices"],
      role: "alumni",
    });

    await Profile.create({
      user_id: faculty._id,
      full_name: "Dr. Smith",
      bio: "Associate Professor of Computer Science",
      phone: "+1234567892",
      location: "Boston, MA",
      skills: ["Research", "Teaching", "Machine Learning", "Data Science"],
      role: "faculty",
    });

    console.log("✅ Profiles created");

    // Create opportunities
    const opp1 = await Opportunity.create({
      title: "Software Engineer Intern",
      description: "Join our team as a software engineering intern",
      type: "Internship",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salary: "5000/month",
      posted_by: alumni._id,
    });

    const opp2 = await Opportunity.create({
      title: "Full Stack Developer",
      description: "Looking for an experienced full stack developer",
      type: "Full-time",
      company: "StartUp Inc",
      location: "Remote",
      salary: "80000/year",
      posted_by: alumni._id,
    });

    const opp3 = await Opportunity.create({
      title: "Research Assistant",
      description: "Help with machine learning research projects",
      type: "Part-time",
      company: "University Lab",
      location: "Boston, MA",
      salary: "20/hour",
      posted_by: faculty._id,
    });

    console.log("✅ Opportunities created");

    // Create sample applications
    await Application.create({
      opportunity: opp1._id,
      opportunity_title: opp1.title,
      student_id: student._id,
      cover_letter: "I am very interested in this internship opportunity...",
      resume_base64: "base64_encoded_resume_data_here",
      resume_name: "john_student_resume.pdf",
      cgpa: 8.5,
      tenth_percentage: 85.5,
      twelfth_percentage: 90.0,
      status: "pending",
    });

    console.log("✅ Applications created");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n🔐 Test credentials:");
    console.log("Student: student@test.com / password123");
    console.log("Alumni:  alumni@test.com / password123");
    console.log("Faculty: faculty@test.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
