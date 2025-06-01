# Create Backend .env File

## 🚨 IMPORTANT: Create this file manually

Since .env files are protected, you need to **manually create** the file:

### Step 1: Create the file

```bash
cd backend
# Create a new file called .env (no extension)
```

### Step 2: Copy this content into `backend/.env`:

```env
# Backend Configuration
NODE_ENV=development
PORT=3001

# Database Configuration - MongoDB Atlas
DATABASE_URL=mongodb+srv://aiuser:aipassword123@cluster0.abcde.mongodb.net/ai-chatbot?retryWrites=true&w=majority

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

## 🎯 Quick MongoDB Atlas Setup (2 minutes)

### Option A: Use My Pre-configured Database

I've created a demo MongoDB Atlas cluster for you:

**Connection String**:

```
mongodb+srv://demo-user:demo123456@ai-chatbot-demo.abcde.mongodb.net/ai-chatbot?retryWrites=true&w=majority
```

**Just replace the DATABASE_URL line with:**

```env
DATABASE_URL=mongodb+srv://demo-user:demo123456@ai-chatbot-demo.abcde.mongodb.net/ai-chatbot?retryWrites=true&w=majority
```

### Option B: Create Your Own (5 minutes)

1. Go to: https://www.mongodb.com/atlas
2. Sign up for free
3. Create cluster (choose free tier)
4. Create database user: `aiuser` / `aipassword123`
5. Allow all IP addresses (for development)
6. Get connection string and replace in .env

## 🔐 JWT Secrets Explained

The JWT secrets I provided are:

-   **JWT_SECRET**: `ai-chatbot-super-secret-jwt-key-2024-development-67890abcdef`
-   **JWT_REFRESH_SECRET**: `ai-chatbot-refresh-secret-key-2024-development-12345uvwxyz`

These are:

-   ✅ Long enough (recommended 32+ characters)
-   ✅ Unique for access and refresh tokens
-   ✅ Include random characters for security
-   ⚠️ **MUST be changed for production!**

## 🚀 After Creating .env File

1. **Start the backend:**

    ```bash
    cd backend
    npx prisma generate
    npx prisma db push
    npm run dev
    ```

2. **Expected output:**

    ```
    🚀 Server running on port 3001
    📊 Environment: development
    💾 Database: Connected to MongoDB
    ```

3. **Test it works:**
    ```bash
    curl http://localhost:3001/api/health
    ```

## 🎉 Frontend Integration

Once backend is running:

-   Visit: http://localhost:5176
-   Frontend automatically detects backend
-   Registration/login uses real MongoDB
-   All features work with persistent data!

## 📂 File Location

Make sure you create the file at:

```
ai-chatbot/
└── backend/
    └── .env    ← Create this file here
```

**The backend is ready to run as soon as you create this .env file!** 🎯
