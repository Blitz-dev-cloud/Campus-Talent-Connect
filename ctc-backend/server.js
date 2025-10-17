const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your-secret-key-123456789";
const expiresIn = "24h";

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => {
    if (err) {
      return false;
    }
    return decode;
  });
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  const db = router.db;
  const user = db.get("users").find({ email, password }).value();
  return user !== undefined ? user : false;
}

// Add CORS headers
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Login endpoint
server.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = isAuthenticated({ email, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const access_token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
  });

  const refresh_token = createToken({
    id: user.id,
    email: user.email,
  });

  return res.status(200).json({
    access: access_token,
    refresh: refresh_token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
  });
});

// Register endpoint
server.post("/api/auth/register", (req, res) => {
  const { email, password, role, full_name } = req.body;
  const db = router.db;

  // Check if user already exists
  const existingUser = db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    email,
    password,
    role: role || "student",
    full_name,
  };

  db.get("users").push(newUser).write();

  // Create profile
  const newProfile = {
    id: Date.now() + 1,
    user_id: newUser.id,
    full_name,
    bio: "",
    phone: "",
    location: "",
    skills: [],
    role: role || "student",
  };

  db.get("profiles").push(newProfile).write();

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Protected routes middleware
server.use(/^\/api\/(?!auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Get user's own opportunities
server.get("/api/opportunities/my-opportunities", (req, res) => {
  const db = router.db;
  const userId = req.user.id;
  const opportunities = db
    .get("opportunities")
    .filter({ posted_by: userId })
    .value();

  return res.status(200).json(opportunities);
});

// Create application
server.post("/api/applications", (req, res) => {
  const db = router.db;
  const { opportunity } = req.body;
  const studentId = req.user.id;

  // Get opportunity details
  const opp = db.get("opportunities").find({ id: opportunity }).value();

  if (!opp) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  // Check if already applied
  const existingApp = db
    .get("applications")
    .find({ opportunity, student_id: studentId })
    .value();

  if (existingApp) {
    return res
      .status(400)
      .json({ message: "Already applied to this opportunity" });
  }

  const newApplication = {
    id: Date.now(),
    opportunity,
    opportunity_title: opp.title,
    student_id: studentId,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  db.get("applications").push(newApplication).write();

  return res.status(201).json(newApplication);
});

// Get user's applications (for students - their own applications)
server.post("/api/applications", (req, res) => {
  const db = router.db;
  const { opportunity, cover_letter, resume_base64, resume_name } = req.body;
  const studentId = req.user.id;

  // Validate required fields
  if (!opportunity) {
    return res.status(400).json({ message: "Opportunity ID is required" });
  }

  // Get opportunity details
  const opp = db.get("opportunities").find({ id: opportunity }).value();

  if (!opp) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  // Check if already applied
  const existingApp = db
    .get("applications")
    .find({ opportunity, student_id: studentId })
    .value();

  if (existingApp) {
    return res
      .status(400)
      .json({ message: "Already applied to this opportunity" });
  }

  const newApplication = {
    id: Date.now(),
    opportunity,
    opportunity_title: opp.title,
    student_id: studentId,
    cover_letter: cover_letter || "", // Store cover_letter
    resume_base64: resume_base64 || "", // Store resume_base64
    resume_name: resume_name || "", // Store resume_name
    status: "pending",
    created_at: new Date().toISOString(),
  };

  db.get("applications").push(newApplication).write();

  return res.status(201).json(newApplication);
});

// Update application status (for faculty/alumni)
server.patch("/api/applications/:id", (req, res) => {
  const db = router.db;
  const applicationId = parseInt(req.params.id);
  const { status } = req.body;
  const userId = req.user.id;

  // Get the application
  const application = db
    .get("applications")
    .find({ id: applicationId })
    .value();

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Get the opportunity to verify ownership
  const opportunity = db
    .get("opportunities")
    .find({ id: application.opportunity })
    .value();

  if (!opportunity || opportunity.posted_by !== userId) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this application" });
  }

  // Update the application status
  db.get("applications").find({ id: applicationId }).assign({ status }).write();

  const updatedApplication = db
    .get("applications")
    .find({ id: applicationId })
    .value();

  return res.status(200).json(updatedApplication);
});

// Use default router for other routes
server.use("/api", router);

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log("\nAvailable endpoints:");
  console.log("POST   /api/auth/login");
  console.log("POST   /api/auth/register");
  console.log("GET    /api/profiles");
  console.log("GET    /api/opportunities");
  console.log("POST   /api/opportunities");
  console.log("GET    /api/opportunities/my-opportunities");
  console.log("GET    /api/applications");
  console.log("POST   /api/applications");
  console.log("PATCH  /api/applications/:id");
  console.log("\nTest credentials:");
  console.log("Student: student@test.com / password123");
  console.log("Alumni:  alumni@test.com / password123");
  console.log("Faculty: faculty@test.com / password123");
});
