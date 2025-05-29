# 🚀 Backend Setup Guide

## ✅ Environment Variables Setup Complete

Your `.env` file has been created with:

-   ✅ Secure JWT secrets (auto-generated)
-   ✅ Default MongoDB configuration
-   ✅ Server and security settings

## 🗄️ Database Setup Options

### Option 1: MongoDB Atlas (Recommended - Cloud Database)

1. **Create MongoDB Atlas Account:**

    - Go to: https://www.mongodb.com/atlas
    - Sign up for free account
    - Create new project

2. **Create Cluster:**

    - Click "Create" → Choose FREE tier (M0)
    - Select cloud provider and region
    - Name your cluster
    - Wait 1-3 minutes for creation

3. **Create Database User:**

    - Go to "Database Access"
    - Add new user with password
    - Set privileges: "Read and write to any database"

4. **Configure Network Access:**

    - Go to "Network Access"
    - Add IP Address → "Allow Access from Anywhere"

5. **Get Connection String:**

    - Go to "Clusters" → Click "Connect"
    - Choose "Connect your application"
    - Copy connection string
    - Replace `<password>` with your user password

6. **Update .env File:**
    ```bash
    node update-env.js
    ```
    Then paste your MongoDB Atlas connection string.

### Option 2: Local MongoDB Installation

1. **Download MongoDB:**

    - Go to: https://www.mongodb.com/try/download/community
    - Download and install MongoDB Community Server

2. **Start MongoDB Service:**

    - Windows: MongoDB should start automatically
    - Or manually: `net start MongoDB`

3. **Verify Installation:**

    ```bash
    mongod --version
    ```

4. **Keep Default .env Configuration:**
    - The `.env` file is already configured for local MongoDB
    - URL: `mongodb://localhost:27017/ai-chatbot`

## 🔧 Next Steps

1. **Generate Prisma Client:**

    ```bash
    npm run prisma:generate
    ```

2. **Push Database Schema:**

    ```bash
    npm run prisma:push
    ```

3. **Start Development Server:**
    ```bash
    npm run dev
    ```

## 📋 Environment Variables Reference

Your `.env` file contains:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/ai-chatbot"

# JWT (Auto-generated secure secrets)
JWT_SECRET="[64-character hex string]"
JWT_REFRESH_SECRET="[64-character hex string]"
JWT_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5177"

# Security & Rate Limiting
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Security Notes

-   ✅ JWT secrets are cryptographically secure (64-byte random)
-   ✅ Password hashing uses bcrypt with 12 salt rounds
-   ✅ Rate limiting configured (100 requests per 15 minutes)
-   ⚠️ Never commit `.env` file to version control
-   ⚠️ Use different secrets for production

## 🐛 Troubleshooting

### MongoDB Connection Issues:

-   Verify MongoDB is running (local) or connection string is correct (Atlas)
-   Check network access settings in MongoDB Atlas
-   Ensure database user has correct permissions

### JWT Issues:

-   Verify JWT secrets are properly set in `.env`
-   Check that `.env` file is in the backend root directory

### Port Issues:

-   Default port is 3001, change PORT in `.env` if needed
-   Ensure port is not already in use

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Verify all environment variables are set
3. Check MongoDB connection
4. Review console logs for specific errors
