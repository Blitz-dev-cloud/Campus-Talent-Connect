# Campus Talent Connect - MongoDB Migration Guide

## Overview

This guide will help you migrate from the JSON file database to MongoDB with Express.

## Prerequisites

- Node.js installed
- MongoDB connection string (MongoDB Atlas or local MongoDB)
- All dependencies installed (`npm install`)

## Setup Steps

### 1. Create Environment File

Create a `.env` file in the `ctc-backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-talent-connect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-123456789
PORT=8000
```

### 2. Seed the Database

Run the seed script to populate MongoDB with initial data:

```bash
npm run seed:mongodb
```

This will create:

- 3 test users (student, alumni, faculty)
- 3 profiles
- 3 sample opportunities
- 1 sample application

### 3. Start the MongoDB Server

Start the new Express + MongoDB server:

```bash
npm run start:mongodb
```

Or for development with auto-reload:

```bash
npm run dev:mongodb
```

The server will run on `http://localhost:8000`

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profiles (Protected)

- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/user/:userId` - Get profile by user ID
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Opportunities

- `GET /api/opportunities` - Get all opportunities (public)
- `GET /api/opportunities/:id` - Get single opportunity (public)
- `GET /api/opportunities/my-opportunities` - Get my opportunities (protected)
- `POST /api/opportunities` - Create opportunity (protected)
- `PUT /api/opportunities/:id` - Update opportunity (protected)
- `DELETE /api/opportunities/:id` - Delete opportunity (protected)

### Applications (All Protected)

- `GET /api/applications` - Get applications (filtered by role)
- `GET /api/applications/:id` - Get single application
- `GET /api/applications/my-applications` - Get my applications
- `POST /api/applications` - Submit application
- `PATCH /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Delete application

## Test Credentials

```
Student: student@test.com / password123
Alumni:  alumni@test.com / password123
Faculty: faculty@test.com / password123
```

## Key Differences from JSON Server

### 1. MongoDB ObjectIds

- MongoDB uses ObjectIds (e.g., `507f1f77bcf86cd799439011`) instead of integer IDs
- When referencing documents, use the `_id` field

### 2. Authentication

- Passwords are now hashed with bcrypt
- JWT tokens include user information

### 3. Relationships

- Uses MongoDB references instead of JSON foreign keys
- Use `.populate()` to fetch related documents

### 4. Validation

- Mongoose schemas provide validation
- Enum fields ensure valid values

## Frontend Changes Needed

### Update API Calls

If your frontend expects integer IDs, you may need to update it to handle MongoDB ObjectIds:

```javascript
// Before (JSON Server)
const userId = 1;

// After (MongoDB)
const userId = "507f1f77bcf86cd799439011";
```

### Check Profile Lookup

The frontend should query profiles by `user_id` instead of matching integer IDs:

```javascript
// Before
const userProfile = profiles.find((p) => p.user_id === user.id);

// After (MongoDB returns ObjectIds)
const userProfile = profiles.find(
  (p) => p.user_id === user.id || p.user_id._id === user.id
);
```

Or fetch directly:

```javascript
const profile = await api.get(`/api/profiles/user/${user.id}`);
```

## Troubleshooting

### Connection Issues

If you can't connect to MongoDB:

1. Check your `MONGODB_URI` in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify username and password are correct
4. Check firewall settings

### Port Already in Use

If port 8000 is busy:

1. Change `PORT` in `.env`
2. Update frontend API base URL accordingly

### Authentication Errors

If getting 401 errors:

1. Ensure JWT_SECRET matches in `.env`
2. Check token is included in headers: `Authorization: Bearer <token>`
3. Verify token hasn't expired (24h expiry)

## Running Both Servers

You can run both the old JSON server and new MongoDB server on different ports for testing:

**JSON Server (old):**

```bash
npm start  # Port 8000
```

**MongoDB Server (new):**

```bash
# Change PORT in .env to 8001
npm run start:mongodb  # Port 8001
```

## Migration Checklist

- [ ] Created `.env` file with MongoDB connection string
- [ ] Installed dependencies (`npm install`)
- [ ] Ran seed script (`npm run seed:mongodb`)
- [ ] Started MongoDB server (`npm run start:mongodb`)
- [ ] Tested login with test credentials
- [ ] Updated frontend API base URL if needed
- [ ] Tested all main features (login, register, profiles, opportunities, applications)
- [ ] Verified authentication works correctly
- [ ] Checked that file uploads (resumes) work

## Next Steps

1. Test all application features thoroughly
2. Update frontend to handle MongoDB ObjectIds if needed
3. Add error handling and validation as needed
4. Consider adding indexes for performance
5. Set up proper environment variables for production
6. Deploy to a hosting service (Heroku, Railway, Render, etc.)
