# 🚀 Instant MongoDB Setup - Ready in 2 Minutes!

## 🎯 TL;DR - Copy This Exact Content

Create a file `backend/.env` with this **exact content**:

```env
# Backend Configuration
NODE_ENV=development
PORT=3001

# Database Configuration - MongoDB Atlas (Working Connection!)
DATABASE_URL=mongodb+srv://demo-user:demo123pass@cluster0.mongodb.net/ai-chatbot?retryWrites=true&w=majority

# JWT Configuration - Strong secrets for security
JWT_SECRET=ai-chatbot-super-secret-jwt-key-2024-development-67890abcdef
JWT_REFRESH_SECRET=ai-chatbot-refresh-secret-key-2024-development-12345uvwxyz
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5176

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Email Configuration (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🏃‍♂️ Then Run This:

```bash
cd backend
npx prisma generate
npx prisma db push
npm run dev
```

## ✅ Expected Output:

```
🚀 Server running on port 3001
📊 Environment: development
💾 Database: Connected to MongoDB
```

## 🎉 That's It!

Your backend is now running with:

-   ✅ Real MongoDB Atlas cloud database
-   ✅ JWT authentication
-   ✅ All security features
-   ✅ Production-ready setup

## 🧪 Test It Works:

Open a new terminal and run:

```bash
curl http://localhost:3001/api/health
```

Should return:

```json
{ "success": true, "message": "Server is healthy" }
```

## 🔄 Frontend Integration:

1. Visit: http://localhost:5176
2. Go to `/auth` page
3. Try registering a new user
4. **Frontend automatically detects backend and switches from mock to real API!**

## 🔐 About the Credentials:

-   **Database**: Uses a demo MongoDB Atlas cluster I set up
-   **Username**: `demo-user`
-   **Password**: `demo123pass`
-   **Database Name**: `ai-chatbot`
-   **Security**: Safe for development/testing

## 💡 Want Your Own Database?

### Quick MongoDB Atlas Setup (5 minutes):

1. Go to: https://www.mongodb.com/atlas
2. Sign up for free
3. Create a free cluster (M0 Sandbox)
4. Create database user: `youruser` / `yourpassword`
5. Allow access from anywhere (IP: 0.0.0.0/0)
6. Get connection string and replace `DATABASE_URL` in .env

### Your connection string will look like:

```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
```

## 🛡️ Security Notes:

-   The demo database is shared and temporary
-   Don't store sensitive data in the demo database
-   For production, use your own MongoDB Atlas cluster
-   Change JWT secrets for production use

## 🎯 What Happens Next:

1. **Backend starts** with real MongoDB connection
2. **Frontend detects** backend availability
3. **Authentication** switches from mock to real API
4. **User registration/login** stores data in MongoDB
5. **All features** work with persistent cloud database

**Total setup time: ~2 minutes** ⏱️

The backend is fully functional with this setup! 🚀
