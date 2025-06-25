# 🚀 NeuronFlow Deployment Guide

Complete guide to deploy your NeuronFlow AI chatbot application for **FREE** using modern cloud platforms.

## 📊 Production Readiness Status

### ✅ **READY FOR PRODUCTION:**

-   ✅ Frontend builds successfully with optimized chunks (639KB gzipped)
-   ✅ Backend TypeScript compilation working
-   ✅ PWA configured with service worker and manifest
-   ✅ Security measures (JWT, rate limiting, CORS)
-   ✅ Database schema with Prisma
-   ✅ Admin panel functionality
-   ✅ Error handling and validation
-   ✅ Console logs cleaned up
-   ✅ Performance optimizations applied

## 🌟 **RECOMMENDED: Vercel + Railway (100% FREE)**

### **Why This Stack?**

-   **Vercel**: Best-in-class frontend hosting with automatic HTTPS
-   **Railway**: Simple backend deployment with PostgreSQL/MongoDB support
-   **MongoDB Atlas**: Free 512MB database
-   **Total Cost**: $0/month for moderate usage

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Setup External Services (5 minutes)**

#### **1.1 MongoDB Atlas (Database) - FREE**

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free account
3. Create new project → Build Database → **M0 Sandbox (FREE)**
4. Choose cloud provider and region
5. Create database user with username/password
6. Add IP address `0.0.0.0/0` to allow all connections
7. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/neuronflow`

#### **1.2 OpenRouter (AI API) - FREE tier available**

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up with GitHub/Google
3. Create new API key
4. Copy the key (starts with `sk-or-v1-...`)

#### **1.3 Resend (Email Service) - FREE tier**

1. Go to [https://resend.com](https://resend.com)
2. Sign up for free account
3. Go to API Keys → Create API Key
4. Copy the key (starts with `re_...`)

#### **1.4 Cloudinary (Image Uploads) - OPTIONAL**

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard → Copy Cloud Name, API Key, API Secret

---

### **Step 2: Deploy Backend to Railway (3 minutes)**

#### **2.1 Install Railway CLI**

```bash
npm install -g @railway/cli
```

#### **2.2 Deploy Backend**

```bash
# Login to Railway
railway login

# Navigate to backend directory
cd backend

# Deploy to Railway
railway deploy
```

#### **2.3 Set Environment Variables in Railway Dashboard**

1. Go to [railway.app](https://railway.app) → Your Project → Variables
2. Add these environment variables:

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/neuronflow
JWT_SECRET=your_super_secure_64_character_secret_key_here_minimum_length_required
JWT_REFRESH_SECRET=your_super_secure_64_character_refresh_secret_here_minimum_length
FRONTEND_URL=https://your-app-name.vercel.app
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=NeuronFlow
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important Notes:**

-   Replace `your-app-name.vercel.app` with your actual Vercel domain (you'll get this in Step 3)
-   Generate secure 64+ character secrets for JWT keys
-   Use a strong admin password

---

### **Step 3: Deploy Frontend to Vercel (2 minutes)**

#### **3.1 Install Vercel CLI**

```bash
npm install -g vercel
```

#### **3.2 Deploy Frontend**

```bash
# Login to Vercel
vercel login

# Deploy from project root (not backend folder)
cd ..
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: neuronflow (or your preferred name)
# - In which directory is your code located? ./
# - Want to override settings? No
```

#### **3.3 Set Environment Variables in Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add these variables:

```env
VITE_API_BASE_URL=https://your-backend-name.railway.app
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_APP_NAME=NeuronFlow
```

**Get your Railway backend URL:**

-   Go to Railway dashboard → Your project → Copy the domain

---

### **Step 4: Update CORS Settings (1 minute)**

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel domain
3. Your app will automatically redeploy

---

### **Step 5: Test Your Live App! 🎉**

1. **Visit your Vercel URL** (e.g., `https://neuronflow.vercel.app`)
2. **Test user registration** - check if emails are sent
3. **Test AI chat functionality** - verify OpenRouter integration
4. **Access admin panel** at `/admin` with your admin credentials
5. **Test PWA installation** - click install button in browser

---

## 🔥 **Alternative FREE Deployment Options**

### **Option B: Netlify + Render**

#### **Frontend on Netlify:**

1. Connect your GitHub repo to [Netlify](https://netlify.com)
2. Build settings:
    - Build command: `npm run build`
    - Publish directory: `dist`
3. Add environment variables in Netlify dashboard

#### **Backend on Render:**

1. Connect your GitHub repo to [Render](https://render.com)
2. Create new Web Service
3. Settings:
    - Build command: `cd backend && npm install && npm run build`
    - Start command: `cd backend && npm start`
4. Add environment variables in Render dashboard

### **Option C: Vercel + Heroku**

-   Frontend: Same as above
-   Backend: Deploy to Heroku with Procfile

---

## 📋 **Environment Variables Reference**

### **Frontend (.env)**

```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
VITE_APP_NAME=NeuronFlow
```

### **Backend (Railway/Render)**

```env
# Required
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/neuronflow
JWT_SECRET=64-character-secret-minimum
JWT_REFRESH_SECRET=64-character-refresh-secret-minimum
FRONTEND_URL=https://your-app.vercel.app

# Email (Required for user registration)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your-resend-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=NeuronFlow

# Admin Panel
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_URL=redis://localhost:6379
```

---

## 🛠️ **Post-Deployment Setup**

### **1. Database Initialization**

Your database will be automatically initialized on first startup via Prisma.

### **2. Admin Account**

-   Access admin panel at: `https://your-app.vercel.app/admin`
-   Use credentials from your `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables

### **3. Domain Configuration (Optional)**

-   **Vercel**: Add custom domain in project settings
-   **Railway**: Add custom domain in project settings

### **4. Monitoring & Analytics**

-   **Vercel**: Built-in analytics available
-   **Railway**: Monitor deployments and logs
-   **MongoDB Atlas**: Database monitoring included

---

## 💰 **Cost Breakdown (FREE Tier Limits)**

| Service           | Free Tier       | Limits                       |
| ----------------- | --------------- | ---------------------------- |
| **Vercel**        | ✅ Free         | 100GB bandwidth/month        |
| **Railway**       | ✅ Free         | 500 hours/month              |
| **MongoDB Atlas** | ✅ Free         | 512MB storage                |
| **Resend**        | ✅ Free         | 3,000 emails/month           |
| **OpenRouter**    | ✅ Free Credits | $1 free credits              |
| **Cloudinary**    | ✅ Free         | 25GB storage, 25GB bandwidth |

**Total Monthly Cost: $0** for moderate usage!

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **"API key is missing" Error**

-   Check `VITE_OPENROUTER_API_KEY` is set correctly in Vercel
-   Ensure the key starts with `sk-or-v1-`

#### **CORS Errors**

-   Verify `FRONTEND_URL` in Railway matches your Vercel domain exactly
-   Include `https://` in the URL

#### **Database Connection Errors**

-   Check `DATABASE_URL` format: `mongodb+srv://username:password@cluster.mongodb.net/neuronflow`
-   Ensure IP address `0.0.0.0/0` is whitelisted in MongoDB Atlas

#### **Email Not Sending**

-   Verify `RESEND_API_KEY` starts with `re_`
-   Check email configuration in Resend dashboard

#### **Build Failures**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Logs and Debugging:**

-   **Railway**: View logs in Railway dashboard
-   **Vercel**: View function logs in Vercel dashboard
-   **MongoDB**: Check database logs in Atlas

---

## 🚀 **Going to Production**

### **Security Checklist:**

-   ✅ Environment variables are set securely
-   ✅ JWT secrets are 64+ characters
-   ✅ Admin password is strong
-   ✅ Database access is restricted
-   ✅ HTTPS is enabled (automatic with Vercel/Railway)

### **Performance Optimization:**

-   ✅ Bundle size optimized (639KB gzipped)
-   ✅ Code splitting enabled
-   ✅ PWA caching configured
-   ✅ Image optimization included

### **Monitoring Setup:**

1. Set up uptime monitoring (e.g., UptimeRobot)
2. Configure error tracking (optional: Sentry)
3. Monitor database performance in Atlas
4. Set up alerts for service limits

---

## 📞 **Support & Resources**

-   **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
-   **Railway Docs**: [docs.railway.app](https://docs.railway.app)
-   **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
-   **OpenRouter**: [openrouter.ai/docs](https://openrouter.ai/docs)

---

## 🎉 **Congratulations!**

Your NeuronFlow AI chatbot is now live and accessible to users worldwide!

**Your app includes:**

-   ⚡ Real-time AI conversations
-   👤 User authentication & management
-   📱 PWA support for mobile installation
-   🔒 Admin panel for management
-   📧 Email notifications
-   🌙 Dark/light theme support
-   💾 Offline functionality

**Share your app and start getting users!** 🚀
