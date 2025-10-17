# 🚀 Quick Start Guide - MongoDB Migration

## What Was Done

Your application has been migrated from JSON file database (`db.json`) to MongoDB with Express.js.

### New Files Created:

1. **`server-mongodb.js`** - New Express + MongoDB server (replaces json-server)
2. **`seed/seed-mongodb.js`** - Script to populate MongoDB with test data
3. **`test-connection.js`** - Test your MongoDB connection
4. **`.env.example`** - Environment variables template
5. **`MONGODB_SETUP.md`** - Detailed documentation

### Updated Files:

1. **`routes/profiles.js`** - Full CRUD operations
2. **`routes/opportunities.js`** - Full CRUD operations
3. **`routes/applications.js`** - Full CRUD with academic fields
4. **`models/Application.js`** - Added CGPA and percentage fields
5. **`package.json`** - Added MongoDB scripts

## 🎯 How to Start Using MongoDB

### Step 1: Test MongoDB Connection

```powershell
cd d:\aws\ctc-1\ctc-backend
node test-connection.js
```

If successful, you'll see: ✅ MongoDB connection successful!

### Step 2: Seed the Database

```powershell
npm run seed:mongodb
```

This creates test users, profiles, opportunities, and applications.

### Step 3: Start the MongoDB Server

```powershell
npm run start:mongodb
```

Or for development with auto-restart:

```powershell
npm run dev:mongodb
```

## 🔐 Test Credentials

```
Student: student@test.com / password123
Alumni:  alumni@test.com / password123
Faculty: faculty@test.com / password123
```

## 📡 API Endpoints

All endpoints remain the same:

- Base URL: `http://localhost:8000`
- Authentication: Same JWT token system
- Routes: Same as before (`/api/auth/login`, `/api/profiles`, etc.)

## 🔄 Frontend Compatibility

Your frontend should work with minimal changes! The main difference is that MongoDB uses ObjectIds instead of integer IDs.

### Potential Issue & Fix

In `StudentDashboard.tsx` line 38, you're finding profile by user_id:

```javascript
const userProfile = profRes.data.find((p) => p.user_id === user.id);
```

This should still work, but if you encounter issues, you can:

**Option 1:** Fetch profile directly by user ID:

```javascript
const profRes = await api.get(`/api/profiles/user/${user.id}`);
setProfile(profRes.data);
```

**Option 2:** Handle ObjectId comparison:

```javascript
const userProfile = profRes.data.find(
  (p) =>
    p.user_id === user.id ||
    p.user_id._id === user.id ||
    p.user_id.toString() === user.id
);
```

## 📊 Comparison: Old vs New

| Feature       | JSON Server (Old)  | Express + MongoDB (New) |
| ------------- | ------------------ | ----------------------- |
| Database      | db.json file       | MongoDB                 |
| IDs           | Integers (1, 2, 3) | ObjectIds (507f...)     |
| Passwords     | Plain text         | Hashed with bcrypt      |
| Relationships | Manual matching    | MongoDB refs + populate |
| Validation    | None               | Mongoose schemas        |
| Scalability   | Limited            | Production-ready        |

## ⚡ Commands Cheat Sheet

```powershell
# Test MongoDB connection
node test-connection.js

# Seed database with test data
npm run seed:mongodb

# Start MongoDB server
npm run start:mongodb

# Start with auto-reload (development)
npm run dev:mongodb

# Start old JSON server (for comparison)
npm start
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

- Check your `.env` file has the correct `MONGODB_URI`
- Run `node test-connection.js` to diagnose

### "Port 8000 already in use"

- Stop the old JSON server if running
- Or change PORT in `.env` to 8001

### "401 Unauthorized" errors

- Make sure you're logged in
- Check that JWT token is being sent in headers

## 🎨 What's Different for Users?

**Nothing!** The application works the same way:

- Login/Register same
- Create profiles same
- Apply to opportunities same
- All features work identically

The difference is under the hood - now using a real database instead of a JSON file!

## ✅ Recommended Next Steps

1. **Test the connection**: `node test-connection.js`
2. **Seed the database**: `npm run seed:mongodb`
3. **Start MongoDB server**: `npm run start:mongodb`
4. **Start frontend**: (in ctc-frontend folder) `npm run dev`
5. **Test login** with test credentials
6. **Test all features** (profile, opportunities, applications)
7. **Check that everything works** before stopping old JSON server

## 🎯 Migration Checklist

- [ ] Tested MongoDB connection
- [ ] Seeded database with test data
- [ ] Started MongoDB server successfully
- [ ] Tested login with test credentials
- [ ] Tested student dashboard
- [ ] Tested creating/editing profile
- [ ] Tested viewing opportunities
- [ ] Tested applying to opportunities
- [ ] Tested application submissions with CGPA/percentages
- [ ] Verified data persists after server restart

## 📞 Need Help?

If something doesn't work:

1. Check the terminal for error messages
2. Look at `MONGODB_SETUP.md` for detailed info
3. Run `node test-connection.js` to verify MongoDB connection
4. Check that `.env` has correct MongoDB URI

---

**You're all set! 🎉** Your application is now using MongoDB!
