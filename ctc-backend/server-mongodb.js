require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const opportunityRoutes = require("./routes/opportunities");
const applicationRoutes = require("./routes/applications");

// Import middleware
const auth = require("./middleware/auth");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://campus-talent-connect-6jzx.vercel.app",
      "https://campus-talent-connect.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 resumes
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Campus Talent Connect API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("\n📋 Available endpoints:");
  console.log("POST   /api/auth/login");
  console.log("POST   /api/auth/register");
  console.log("GET    /api/profiles");
  console.log("POST   /api/profiles (protected)");
  console.log("PUT    /api/profiles/:id (protected)");
  console.log("GET    /api/opportunities");
  console.log("POST   /api/opportunities (protected)");
  console.log("GET    /api/opportunities/my-opportunities (protected)");
  console.log("GET    /api/applications");
  console.log("POST   /api/applications (protected)");
  console.log("PATCH  /api/applications/:id (protected)");
  console.log("\n🔐 Test credentials:");
  console.log("Student: student@test.com / password123");
  console.log("Alumni:  alumni@test.com / password123");
  console.log("Faculty: faculty@test.com / password123");
});

module.exports = app;
