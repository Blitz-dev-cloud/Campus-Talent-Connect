# 🎓 Campus Talent Connect (CTC)

<div align="center">

![Campus Talent Connect](https://img.shields.io/badge/Version-1.0.0-indigo?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-fuchsia?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1-cyan?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?style=for-the-badge&logo=mongodb)

**A modern platform connecting students, alumni, and faculty for career opportunities and mentorship**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Campus Talent Connect** is a comprehensive platform designed to bridge the gap between students, alumni, and faculty members. It facilitates career opportunities, mentorship programs, and professional networking within the campus ecosystem.

### Key Objectives

- 🎯 Connect students with alumni for mentorship and career guidance
- 💼 Enable companies to post internship and job opportunities
- 🤝 Facilitate faculty-student collaboration on research projects
- 📊 Track and manage applications efficiently
- 🔔 Real-time notifications for opportunities and updates

---

## ✨ Features

### For Students 👨‍🎓
- **Profile Management**: Create and maintain comprehensive profiles with skills, education, and experience
- **Opportunity Discovery**: Browse internships, jobs, and research opportunities
- **Application Tracking**: Track application status in real-time
- **Interactive Chatbot**: Get instant help and guidance with session memory
- **Notifications**: Receive real-time updates on new opportunities

### For Alumni 🎓
- **Mentorship**: Offer guidance and support to current students
- **Job Posting**: Share career opportunities from their companies
- **Networking**: Connect with fellow alumni and current students
- **Profile Showcase**: Display professional achievements and career journey

### For Faculty 👩‍🏫
- **Research Opportunities**: Post research assistant positions
- **Student Collaboration**: Find talented students for projects
- **Mentorship Programs**: Guide students in academic and career paths
- **Application Review**: Efficiently review and manage student applications

### UI/UX Features 🎨
- **Aurora Nebula Theme**: Stunning gradient color scheme with indigo, purple, fuchsia, and cyan
- **Custom Cursor**: Interactive circular cursor with smooth animations (desktop only)
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Dark Mode Ready**: Modern glassmorphism and backdrop blur effects

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1 with TypeScript
- **Build Tool**: Vite 7.1
- **Styling**: Tailwind CSS 4.1 (with custom Aurora Nebula theme)
- **Animations**: Framer Motion 12.23
- **Routing**: React Router DOM 7.9
- **Icons**: Lucide React 0.545
- **HTTP Client**: Axios 1.12
- **State Management**: React Context API
- **Notifications**: Sonner 2.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1
- **Database**: MongoDB with Mongoose 8.19
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs 3.0
- **CORS**: Enabled for cross-origin requests
- **Email Service**: Resend 6.1

### Development Tools
- **Linting**: ESLint 9.36
- **TypeScript**: 5.9
- **Dev Server**: Nodemon 3.1 (backend hot-reload)

---

## 📁 Project Structure

```
ctc-1/
├── ctc-frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.tsx       # Navigation bar with mobile menu
│   │   │   ├── Footer.tsx       # Animated footer with stats
│   │   │   ├── Chatbot.tsx      # AI chatbot with session memory
│   │   │   ├── NotificationBell.tsx  # Real-time notifications
│   │   │   └── CustomCursor.tsx # Custom animated cursor
│   │   ├── pages/               # Application pages
│   │   │   ├── Landing.tsx      # Landing page with animations
│   │   │   ├── Auth/            # Login & Registration
│   │   │   └── Dashboard/       # Role-based dashboards
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useFetch.ts      # Data fetching hook
│   │   ├── lib/                 # Utility libraries
│   │   │   ├── api.ts           # API client configuration
│   │   │   ├── colors.ts        # Aurora Nebula color system
│   │   │   └── jwt.ts           # JWT utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles & Tailwind
│   ├── package.json
│   └── vite.config.ts           # Vite configuration
│
├── ctc-backend/                  # Express backend API
│   ├── config/
│   │   └── db.js                # MongoDB connection config
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # User model
│   │   ├── Profile.js           # Profile model
│   │   ├── Opportunity.js       # Opportunity model
│   │   └── Application.js       # Application model
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── profiles.js          # Profile CRUD operations
│   │   ├── opportunities.js     # Opportunity endpoints
│   │   └── applications.js      # Application management
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── seed/                    # Database seeding scripts
│   │   ├── seed-mongodb.js      # MongoDB seeder
│   │   └── db.json              # Seed data
│   ├── server-mongodb.js        # MongoDB server
│   ├── server.js                # JSON Server (development)
│   └── package.json
│
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB instance)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Blitz-dev-cloud/Campus-Talent-Connect.git
cd Campus-Talent-Connect
```

### Step 2: Backend Setup

```bash
cd ctc-backend

# Install dependencies
npm install

# Create .env file
# Copy the example below and add your MongoDB URI
```

Create a `.env` file in `ctc-backend/`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/campus-talent-connect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# Server Configuration
PORT=8000
NODE_ENV=development

# Email Configuration (Optional - for Resend)
RESEND_API_KEY=your-resend-api-key
```

### Step 3: Frontend Setup

```bash
cd ../ctc-frontend

# Install dependencies
npm install

# Create .env file
```

Create a `.env` file in `ctc-frontend/`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Step 4: Seed the Database (Optional)

```bash
cd ../ctc-backend

# Seed MongoDB with test data
npm run seed:mongodb
```

This will create:
- 3 test users (student, alumni, faculty)
- Sample profiles
- Mock opportunities
- Test applications

---

## ⚙️ Configuration

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new cluster** (free tier available)
3. **Create a database user** with read/write permissions
4. **Whitelist your IP address** (or allow access from anywhere for development)
5. **Get your connection string** and add it to `.env`

### JWT Secret

Generate a secure JWT secret:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 📦 Usage

### Development Mode

Run both frontend and backend concurrently:

#### Terminal 1 - Backend
```bash
cd ctc-backend
npm run start:mongodb

# Server runs on http://localhost:8000
```

#### Terminal 2 - Frontend
```bash
cd ctc-frontend
npm run dev

# App runs on http://localhost:5173
```

### Production Build

#### Build Frontend
```bash
cd ctc-frontend
npm run build

# Creates optimized build in dist/
```

#### Start Backend
```bash
cd ctc-backend
npm start
```

### Available Scripts

#### Backend Scripts
```bash
npm start              # Start production server
npm run start:mongodb  # Start MongoDB server
npm run dev           # Development with nodemon
npm run seed:mongodb  # Seed database with test data
```

#### Frontend Scripts
```bash
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "student"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@university.edu",
    "full_name": "John Doe",
    "role": "student"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@university.edu",
    "full_name": "John Doe",
    "role": "student"
  }
}
```

### Profile Endpoints

#### Get All Profiles
```http
GET /api/profiles
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "user_id": "507f1f77bcf86cd799439012",
    "bio": "Computer Science student passionate about AI",
    "skills": ["JavaScript", "Python", "React"],
    "education": [...],
    "experience": [...]
  }
]
```

#### Get User's Profile
```http
GET /api/profiles/user/:userId
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "user_id": "507f1f77bcf86cd799439012",
  "bio": "Computer Science student",
  "skills": ["JavaScript", "Python"],
  ...
}
```

#### Create Profile
```http
POST /api/profiles
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": "507f1f77bcf86cd799439012",
  "bio": "Passionate developer",
  "skills": ["React", "Node.js"],
  "education": [
    {
      "institution": "University Name",
      "degree": "B.S. Computer Science",
      "field": "Computer Science",
      "start_date": "2020-09-01",
      "end_date": "2024-06-01",
      "gpa": "3.8"
    }
  ]
}

Response: 201 Created
```

#### Update Profile
```http
PUT /api/profiles/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Updated bio",
  "skills": ["React", "TypeScript", "MongoDB"]
}

Response: 200 OK
```

### Opportunity Endpoints

#### Get All Opportunities
```http
GET /api/opportunities
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Software Engineering Intern",
    "company": "Tech Corp",
    "type": "internship",
    "location": "San Francisco, CA",
    "description": "Exciting internship opportunity...",
    "requirements": ["React", "Node.js"],
    "posted_by": "507f1f77bcf86cd799439012",
    "status": "open"
  }
]
```

#### Create Opportunity
```http
POST /api/opportunities
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Research Assistant",
  "company": "University Lab",
  "type": "research",
  "location": "On Campus",
  "description": "AI research opportunity",
  "requirements": ["Python", "Machine Learning"],
  "posted_by": "507f1f77bcf86cd799439012"
}

Response: 201 Created
```

### Application Endpoints

#### Get User's Applications
```http
GET /api/applications?user_id=507f1f77bcf86cd799439012
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "opportunity_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439012",
    "status": "pending",
    "applied_date": "2025-01-15T10:30:00.000Z"
  }
]
```

#### Submit Application
```http
POST /api/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "opportunity_id": "507f1f77bcf86cd799439013",
  "user_id": "507f1f77bcf86cd799439012",
  "cover_letter": "I am interested in this position..."
}

Response: 201 Created
```

#### Update Application Status
```http
PATCH /api/applications/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "accepted"
}

Response: 200 OK
```

---

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication.

### Token Flow

1. **User Registration/Login**: User provides credentials
2. **Token Generation**: Server creates JWT with user data
3. **Token Storage**: Frontend stores token in localStorage
4. **Authenticated Requests**: Token sent in Authorization header
5. **Token Verification**: Backend middleware validates token

### Protected Routes

All API endpoints except `/auth/register` and `/auth/login` require authentication.

Include the token in request headers:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after **24 hours**. Users need to re-login after expiration.

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  full_name: String (required),
  role: String (enum: ['student', 'alumni', 'faculty']),
  created_at: Date,
  updated_at: Date
}
```

### Profiles Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  bio: String,
  skills: [String],
  education: [{
    institution: String,
    degree: String,
    field: String,
    start_date: Date,
    end_date: Date,
    gpa: String
  }],
  experience: [{
    company: String,
    position: String,
    description: String,
    start_date: Date,
    end_date: Date
  }],
  social_links: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  created_at: Date,
  updated_at: Date
}
```

### Opportunities Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  company: String (required),
  type: String (enum: ['internship', 'job', 'research']),
  location: String,
  description: String,
  requirements: [String],
  posted_by: ObjectId (ref: 'User'),
  posted_date: Date,
  deadline: Date,
  status: String (enum: ['open', 'closed']),
  created_at: Date,
  updated_at: Date
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  opportunity_id: ObjectId (ref: 'Opportunity'),
  user_id: ObjectId (ref: 'User'),
  status: String (enum: ['pending', 'accepted', 'rejected']),
  cover_letter: String,
  applied_date: Date,
  reviewed_date: Date,
  created_at: Date,
  updated_at: Date
}
```

---

## 🎨 UI Components

### Aurora Nebula Theme

The application features a custom "Aurora Nebula" color scheme:

- **Primary**: Indigo (#6366f1) - Electric purple/indigo
- **Secondary**: Fuchsia (#d946ef) - Neon magenta/pink
- **Accent**: Cyan (#06b6d4) - Bright cyan
- **Warm**: Orange (#f97316) - Electric orange

### Custom Cursor

Desktop users experience an interactive custom cursor:
- 16px circular dot (inner cursor)
- 40px ring (outer cursor)
- Smooth spring animations
- Automatically hidden on touch devices

### Responsive Design

- **Mobile** (<768px): Dropdown navbar, optimized layouts
- **Tablet** (768px-1024px): Balanced layouts
- **Desktop** (>1024px): Full features with custom cursor

---

## 🧪 Testing Credentials

After seeding the database, use these credentials:

### Student Account
```
Email: student@university.edu
Password: password123
```

### Alumni Account
```
Email: alumni@company.com
Password: password123
```

### Faculty Account
```
Email: faculty@university.edu
Password: password123
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Code Style

- Follow ESLint rules
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues

- Custom cursor may lag on low-performance devices
- Safari may require additional CSS prefixes for backdrop-filter
- MongoDB Atlas free tier has connection limits

---

## 🔮 Future Enhancements

- [ ] Real-time chat between students and mentors
- [ ] Video interview scheduling
- [ ] Resume builder tool
- [ ] Skills assessment tests
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for analytics
- [ ] Email notifications with Resend integration
- [ ] Advanced search filters
- [ ] Recommendation algorithm
- [ ] Social media integration

---

## 📧 Contact & Support

**Project Repository**: [github.com/Blitz-dev-cloud/Campus-Talent-Connect](https://github.com/Blitz-dev-cloud/Campus-Talent-Connect)

**Report Issues**: [GitHub Issues](https://github.com/Blitz-dev-cloud/Campus-Talent-Connect/issues)

---

<div align="center">

**Made with ❤️ for the campus community**

⭐ Star this repo if you find it helpful!

</div>
