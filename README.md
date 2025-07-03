# 🧠 NeuronFlow - AI-Powered Conversational Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

> **A modern, feature-rich AI chatbot platform with offline support, voice interaction, document processing, and enterprise-grade security.**

![NeuronFlow Landing Page](https://img.shields.io/badge/Demo-Live%20Preview-brightgreen)

## 🌟 **Key Features**

### 🤖 **AI & Conversation**

-   **5 AI Models**: GPT-4, Claude, Gemini, Llama, and more via OpenRouter
-   **Smart Personas**: 12+ specialized AI personalities (Developer, Writer, Analyst, etc.)
-   **Context Awareness**: Advanced memory system remembers conversation history
-   **Real-time Streaming**: Live response generation with typing indicators
-   **Quick Responses**: Pre-built conversation starters and templates

### 📱 **Progressive Web App (PWA)**

-   **Offline Functionality**: Works completely offline with cached conversations
-   **Native App Experience**: Install on mobile/desktop like a native app
-   **Instant Loading**: Landing page and core features load instantly offline
-   **Smart Caching**: 30-day static asset cache, 1-day user data cache
-   **Push Notifications**: Real-time updates and engagement alerts

### 🎤 **Voice & Accessibility**

-   **Voice Input**: Speech-to-text with multiple language support
-   **Voice Output**: Text-to-speech with customizable voices and settings
-   **Multilingual**: Support for 20+ languages
-   **Accessibility**: Full keyboard navigation, screen reader compatible
-   **Dark/Light Themes**: System-aware theme switching

### 📄 **Document Processing**

-   **Multi-format Support**: PDF, DOCX, TXT, images (OCR)
-   **Smart Chunking**: Intelligent document segmentation for AI processing
-   **Document Chat**: Ask questions about uploaded documents
-   **Batch Processing**: Handle multiple documents simultaneously
-   **Export Options**: Download conversations in JSON, PDF, CSV, Markdown

### 👤 **User Management & Security**

-   **JWT Authentication**: Secure token-based authentication with refresh tokens
-   **Email Verification**: Account verification with customizable templates
-   **Password Reset**: Secure password recovery flow
-   **Profile Management**: Avatar upload with image optimization
-   **Admin Panel**: User management, system health monitoring
-   **Rate Limiting**: API protection against abuse

### 📊 **Analytics & Insights**

-   **Conversation Analytics**: Message frequency, response times, usage patterns
-   **Performance Metrics**: System health, API response times, error tracking
-   **User Insights**: Engagement metrics, feature usage statistics
-   **Export Analytics**: Download detailed usage reports
-   **Real-time Dashboard**: Live system monitoring

### 🔄 **Data Management**

-   **Cloud Sync**: Automatic conversation synchronization across devices
-   **Local Storage**: Offline data persistence with IndexedDB
-   **Guest Mode**: Use without registration with session persistence
-   **Data Export**: Complete data portability in multiple formats
-   **Backup & Restore**: Comprehensive data backup solutions

## 👑 **Admin Features**

-   **User Management**: View, edit, suspend, activate, and delete users
-   **System Health Monitoring**: Real-time system status and performance metrics
-   **Feature Flags**: Create, edit, toggle, and delete feature flags with rollout percentages
-   **Analytics Dashboard**: User growth, model usage statistics, geographic data, and engagement metrics
-   **User Actions**: Suspend/activate user accounts, complete user deletion with data cleanup
-   **Feature Flag Management**: Control feature rollouts, target specific users, manage environments

## 🚀 **Quick Start**

### **Try It Live**

-   **Frontend**: [https://neuronflow.vercel.app](https://neuronflow.vercel.app)
-   **Demo Account**: Sign up for free or use guest mode

### **Admin Login**

> **Default Admin Credentials (for local/dev):**
>
> -   **Email:** admin@yourdomain.com
> -   **Password:** SecurePassword123!
>
> _You can change these in `backend/.env` as needed._

### **Local Development**

#### **Prerequisites**

-   Node.js 18+ and npm
-   MongoDB (local or Atlas)
-   OpenRouter API key (optional for AI features)

#### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/neuronflow.git
cd neuronflow

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### **Environment Setup**

**Frontend (.env)**

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_APP_NAME=NeuronFlow
```

**Backend (backend/.env)**

```env
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/neuronflow
JWT_SECRET=your_super_secure_64_character_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_64_character_refresh_secret_here
FRONTEND_URL=http://localhost:5173
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=NeuronFlow
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### **Run the Application**

```bash
# Start backend server (Terminal 1)
cd backend
npm run dev

# Start frontend development server (Terminal 2)
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ **Architecture**

### **Frontend Stack**

-   **React 18** with TypeScript
-   **Vite** for blazing-fast development
-   **Tailwind CSS** for styling
-   **Framer Motion** for animations
-   **Zustand** for state management
-   **React Query** for API state management
-   **Workbox** for PWA functionality

### **Backend Stack**

-   **Node.js** with Express.js
-   **TypeScript** for type safety
-   **Prisma ORM** with MongoDB
-   **JWT** for authentication
-   **Cloudinary** for image processing
-   **Resend** for email services
-   **Rate limiting** and security middleware

### **Database Schema**

```typescript
// Core Models
User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  isVerified: boolean
  preferences: Json
  createdAt: DateTime
  conversations: Conversation[]
}

Conversation {
  id: string
  title: string
  userId: string
  messages: Message[]
  isPinned: boolean
  createdAt: DateTime
  updatedAt: DateTime
}

Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  conversationId: string
  createdAt: DateTime
}
```

## 📱 **Mobile App Features**

### **PWA Installation**

1. **Android**: Chrome menu → "Add to Home screen"
2. **iOS**: Safari Share → "Add to Home Screen"
3. **Desktop**: Browser address bar → Install button

### **Offline Capabilities**

-   ✅ Landing page loads instantly
-   ✅ View cached conversations
-   ✅ Access settings and profile
-   ✅ Full UI functionality
-   ❌ AI chat (requires internet)
-   ❌ New user registration

### **Performance Optimizations**

-   **Instant profile avatars** with fallback to initials
-   **Non-blocking chat loading** shows cached data immediately
-   **Auto-close sidebar** on mobile chat selection
-   **Optimized bundle size** with code splitting

## 🔧 **API Reference**

### **Authentication**

```typescript
POST / auth / register; // Register new user
POST / auth / login; // User login
POST / auth / logout; // User logout
POST / auth / refresh; // Refresh JWT token
PUT / auth / change - password; // Change password
POST / auth / forgot - password; // Request password reset
POST / auth / reset - password; // Reset password with token
```

### **Conversations**

```typescript
GET    /conversations     // Get user conversations
POST   /conversations     // Create new conversation
GET    /conversations/:id // Get specific conversation
PUT    /conversations/:id // Update conversation
DELETE /conversations/:id // Delete conversation
```

### **Messages**

```typescript
GET    /conversations/:id/messages // Get conversation messages
POST   /conversations/:id/messages // Send new message
DELETE /messages/:id               // Delete specific message
```

### **User Management**

```typescript
GET / auth / profile; // Get user profile
PUT / auth / profile; // Update user profile
POST / auth / avatar; // Upload profile picture
DELETE / auth / account; // Delete user account
```

## 🛠️ **Development Guide**

### **Project Structure**

```
neuronflow/
├── src/
│   ├── components/          # React components
│   │   ├── chat/           # Chat-related components
│   │   ├── layout/         # Layout components
│   │   ├── ui/             # Reusable UI components
│   │   └── auth/           # Authentication components
│   ├── pages/              # Route pages
│   ├── stores/             # Zustand state stores
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Backend utilities
│   │   └── types/          # TypeScript types
│   └── prisma/             # Database schema
└── public/                 # Static assets
```

### **Adding New Features**

1. **Create Component**

```bash
# Create new component
mkdir src/components/feature-name
touch src/components/feature-name/FeatureName.tsx
```

2. **Add Store (if needed)**

```typescript
// src/stores/featureStore.ts
import { create } from 'zustand';

interface FeatureState {
	data: any[];
	loading: boolean;
	setData: (data: any[]) => void;
}

export const useFeatureStore = create<FeatureState>(
	(set) => ({
		data: [],
		loading: false,
		setData: (data) => set({ data }),
	})
);
```

3. **Add API Service**

```typescript
// src/services/featureService.ts
import { API_BASE_URL } from '../config';

export const featureService = {
	async getData() {
		const response = await fetch(
			`${API_BASE_URL}/api/feature`
		);
		return response.json();
	},
};
```

### **Code Quality**

-   **ESLint**: Configured for TypeScript and React
-   **Prettier**: Consistent code formatting
-   **TypeScript**: Strict type checking
-   **Husky**: Pre-commit hooks for quality checks

## 🚀 **Deployment**

### **Recommended: Vercel + Railway (FREE)**

#### **1. Deploy Backend to Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway deploy
```

Set environment variables in Railway dashboard.

#### **2. Deploy Frontend to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard.

### **Alternative Platforms**

-   **Frontend**: Netlify, AWS Amplify, GitHub Pages
-   **Backend**: Heroku, DigitalOcean, AWS Elastic Beanstalk
-   **Database**: MongoDB Atlas (free 512MB)

### **Environment Variables for Production**

**Frontend (Vercel)**

```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_APP_NAME=NeuronFlow
```

**Backend (Railway)**

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/neuronflow
JWT_SECRET=64-character-secret-minimum
JWT_REFRESH_SECRET=64-character-refresh-secret-minimum
FRONTEND_URL=https://your-app.vercel.app
EMAIL_PROVIDER=resend
RESEND_API_KEY=your-resend-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📊 **Performance Metrics**

### **Lighthouse Scores**

-   **Performance**: 95+
-   **Accessibility**: 100
-   **Best Practices**: 95+
-   **SEO**: 100
-   **PWA**: 100

### **Bundle Analysis**

-   **Gzipped Size**: ~632KB (main bundle)
-   **Initial Load**: < 2s on 3G
-   **Time to Interactive**: < 3s
-   **First Contentful Paint**: < 1.5s

### **Database Performance**

-   **Average Query Time**: < 50ms
-   **Connection Pooling**: Optimized for concurrent users
-   **Indexing**: Strategic indexes on frequently queried fields

## 🔒 **Security Features**

### **Authentication & Authorization**

-   JWT tokens with automatic refresh
-   Password hashing with bcrypt
-   Rate limiting on authentication endpoints
-   Email verification for new accounts
-   Secure password reset flow

### **Data Protection**

-   CORS protection with environment-specific origins
-   Input validation and sanitization
-   SQL injection protection via Prisma ORM
-   XSS protection with Content Security Policy
-   HTTPS enforcement in production

### **Privacy**

-   Minimal data collection
-   User data encryption at rest
-   Option to delete all user data
-   No tracking without consent
-   GDPR compliance features

## 🤝 **Contributing**

### **Getting Started**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Development Guidelines**

-   Follow existing code style and conventions
-   Write meaningful commit messages
-   Add tests for new features
-   Update documentation as needed
-   Ensure all tests pass before submitting

### **Bug Reports**

Please include:

-   Browser and version
-   Steps to reproduce
-   Expected vs actual behavior
-   Screenshots if applicable

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

-   **OpenRouter** for AI model access
-   **Vercel** for frontend hosting
-   **Railway** for backend hosting
-   **MongoDB Atlas** for database hosting
-   **Cloudinary** for image processing
-   **Resend** for email services

## 📞 **Support**

-   **Documentation**: [GitHub Wiki](https://github.com/your-username/neuronflow/wiki)
-   **Issues**: [GitHub Issues](https://github.com/your-username/neuronflow/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/your-username/neuronflow/discussions)
-   **Email**: support@neuronflow.com

---

**Made with ❤️ by [Your Name]**

_NeuronFlow - Empowering conversations with AI_
