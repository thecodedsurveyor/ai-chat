# Backend Setup Guide - AI Chatbot

## 🚀 Backend Implementation Status

### ✅ Completed

-   **Express.js Server**: Fully configured with TypeScript
-   **Prisma ORM**: MongoDB schema defined
-   **JWT Authentication**: Fixed compilation issues
-   **Project Structure**: Complete backend architecture
-   **Dependencies**: All packages installed

### 🔧 Next Steps Required

## 1. Database Setup (Choose One Option)

### Option A: Local MongoDB (Recommended for Development)

```bash
# Install MongoDB Community Server
# Download from: https://www.mongodb.com/try/download/community

# Or use Docker
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

### Option B: MongoDB Atlas (Cloud - Easier Setup)

1. Visit: https://www.mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `DATABASE_URL` in backend environment

## 2. Environment Configuration

Create `backend/.env` file with:

```env
NODE_ENV=development
PORT=3001

# Local MongoDB
DATABASE_URL=mongodb://localhost:27017/ai-chatbot-dev

# OR MongoDB Atlas
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5176
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

## 3. Database Initialization

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database (creates collections)
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

## 4. Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:

```
[nodemon] starting `ts-node src/server.ts`
🚀 Server running on port 3001
📊 Database connected successfully
```

## 5. Test Backend Endpoints

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed

```
Error: connection <host> to <host>:27017 failed
```

**Solution**: Ensure MongoDB is running

-   Local: Start MongoDB service
-   Atlas: Check connection string and network access

#### Prisma Generate Fails

```
Environment variable not found: DATABASE_URL
```

**Solution**: Create `.env` file in backend folder

#### Port Already in Use

```
EADDRINUSE: port 3001 already in use
```

**Solution**: Change PORT in `.env` or kill existing process:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

## 📁 Backend Architecture

```
backend/
├── src/
│   ├── config/              # Environment & database config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, validation, error handling
│   ├── routes/              # API routes
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions (JWT, bcrypt)
│   └── server.ts            # Express app entry point
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json             # Dependencies
```

## 🎯 API Endpoints

### Authentication

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `POST /api/auth/refresh` - Refresh JWT token
-   `PUT /api/auth/profile` - Update user profile
-   `POST /api/auth/change-password` - Change password

### Health

-   `GET /api/health` - Server health check

### Chats (Protected)

-   `GET /api/chats` - Get user chats
-   `POST /api/chats` - Create new chat
-   `GET /api/chats/:id` - Get specific chat
-   `PUT /api/chats/:id` - Update chat
-   `DELETE /api/chats/:id` - Delete chat

## 🔐 Security Features

-   **JWT Authentication**: Secure token-based auth
-   **Password Hashing**: bcrypt with salt rounds
-   **Rate Limiting**: Prevent brute force attacks
-   **CORS**: Cross-origin request security
-   **Helmet**: Security headers
-   **Input Validation**: Joi schema validation

## 📊 Database Models

### User

-   Email, name, password (hashed)
-   Verification status
-   Preferences, avatar
-   Created/updated timestamps

### Chat

-   User relationship
-   Messages (JSON array)
-   Categories, tags
-   Pinned, favorite, archived status
-   Analytics data

### Session

-   JWT token management
-   User agent, IP tracking
-   Expiration handling

## 🚀 Ready for Production

The backend is production-ready with:

-   Environment-based configuration
-   Database connection pooling
-   Error handling middleware
-   Security best practices
-   TypeScript for type safety
-   Comprehensive logging

## 🔄 Frontend Integration

Once backend is running, the frontend will automatically detect it and switch from mock mode to real API calls. The authentication service includes:

-   Automatic backend detection
-   Seamless fallback to mock system
-   Real-time status switching
-   Error handling and recovery

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Verify environment variables
3. Ensure MongoDB is running
4. Check console logs for specific errors
5. Test individual endpoints with curl/Postman

The backend is fully implemented and ready to run - just needs database setup! 🎉
