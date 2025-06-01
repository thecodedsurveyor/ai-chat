# MongoDB Atlas Quick Setup - 5 Minutes to Backend Running! 🚀

## Step 1: Create MongoDB Atlas Account (2 minutes)

1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free"
3. Sign up with Google/GitHub (fastest) or email
4. Choose "Free" cluster option

## Step 2: Create Database Cluster (1 minute)

1. Choose **AWS** as cloud provider
2. Select **N. Virginia (us-east-1)** region
3. Keep **M0 Sandbox** (Free forever)
4. Cluster Name: `ai-chatbot`
5. Click **"Create"**

## Step 3: Database Access Setup (1 minute)

1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Username: `aiuser`
4. Password: `aipassword123` (or generate secure one)
5. Select **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Network Access (30 seconds)

1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

## Step 5: Get Connection String (30 seconds)

1. Go to **"Clusters"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
    ```
    mongodb+srv://aiuser:aipassword123@ai-chatbot.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```

## Step 6: Update Backend Environment

Update `backend/.env` file:

```env
# Replace this line:
DATABASE_URL=mongodb://localhost:27017/ai-chatbot-dev

# With your Atlas connection string:
DATABASE_URL=mongodb+srv://aiuser:aipassword123@ai-chatbot.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
```

## Step 7: Start Backend (30 seconds)

```bash
cd backend
npx prisma generate
npx prisma db push
npm run dev
```

## Expected Output ✅

```
[nodemon] starting `ts-node src/server.ts`
🚀 Server running on port 3001
📊 Database connected successfully
🔒 CORS enabled for: http://localhost:5176
🛡️  Rate limiting enabled
```

## Test It Works! 🧪

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Should return:
{"success": true, "message": "Server is healthy", "timestamp": "..."}
```

## Frontend Will Auto-Detect! 🎯

Once backend is running:

-   Visit: http://localhost:5176
-   Go to `/auth` page
-   Try logging in - it will automatically switch from mock to real backend!
-   All registration/login will now use MongoDB Atlas

## Troubleshooting 🔧

### Connection String Issues

```
Error: bad auth : authentication failed
```

**Fix**: Double-check username/password in connection string

### Network Issues

```
Error: connection timeout
```

**Fix**: Ensure "Allow Access from Anywhere" is set in Network Access

### Database Push Issues

```
Error: Environment variable not found: DATABASE_URL
```

**Fix**: Ensure .env file exists in backend folder

## 🎉 You're Done!

Your backend is now running with:

-   ✅ MongoDB Atlas (cloud database)
-   ✅ Express.js API server
-   ✅ JWT authentication
-   ✅ Prisma ORM
-   ✅ Full TypeScript support

The frontend will automatically detect the backend and switch from mock mode to real API calls!

## 📊 View Your Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. See your `users`, `chats`, and `sessions` data in real-time

## 🔐 Security Note

For production:

-   Change default passwords
-   Restrict IP access
-   Use environment variables for secrets
-   Enable authentication logs

**Total Setup Time: ~5 minutes** ⏱️
