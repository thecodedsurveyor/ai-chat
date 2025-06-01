# �� Resend Email Setup Guide - No Domain Required

## 🎯 **Overview**

This guide shows you how to set up Resend email service for development and testing **without needing to verify your own domain**. Perfect for development, testing, and demo purposes.

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Get Your Resend API Key**

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to **API Keys** in your dashboard
4. Click **Create API Key**
5. Copy the key (starts with `re_...`)

### **Step 2: Configure Environment Variables**

Add these to your `backend/.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_YourApiKeyHere
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME=Your App Name
```

### **Step 3: Add Verified Recipients**

1. In your Resend dashboard, go to **Domains**
2. Find the `resend.dev` domain (pre-verified)
3. Go to **Verified Recipients** or **Audience**
4. Add your email address(es) for testing

---

## ⚙️ **Configuration Details**

### **Environment Variables Explained**

```env
# Required: Your Resend API key
RESEND_API_KEY=re_abc123...

# Use Resend's testing domain (no verification needed)
EMAIL_FROM_ADDRESS=onboarding@resend.dev

# Customize the sender name
EMAIL_FROM_NAME=AI Chat Platform

# Optional: Override in production
NODE_ENV=development
```

### **Why `onboarding@resend.dev`?**

-   ✅ **Pre-verified** - No domain setup required
-   ✅ **Free to use** - Works with free Resend accounts
-   ✅ **Instant setup** - Start sending emails immediately
-   ✅ **Professional appearance** - Looks legitimate to recipients

---

## 🎛️ **Testing Setup**

### **Add Test Recipients**

In Resend dashboard:

1. **Domains** → **resend.dev** → **Settings**
2. **Add verified recipient emails**
3. Recipients will receive a verification email
4. Once verified, they can receive your app's emails

### **Recommended Test Emails**

Add these email addresses as verified recipients:

-   Your personal email
-   Your development team emails
-   Test email accounts (Gmail, Yahoo, etc.)

---

## 💻 **Code Configuration**

### **Backend Email Service**

Your `backend/src/services/emailService.ts` should use:

```typescript
private getFromAddress(): string {
    const fromAddress =
        process.env.EMAIL_FROM_ADDRESS ||
        'onboarding@resend.dev';
    const fromName =
        process.env.EMAIL_FROM_NAME ||
        'AI Chat';
    return `${fromName} <${fromAddress}>`;
}
```

### **Environment Loading**

Make sure your backend loads the `.env` file:

```typescript
// backend/src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config();

// Email Configuration
RESEND_API_KEY: process.env.RESEND_API_KEY || 'your-key-here',
```

---

## 🧪 **Testing Your Setup**

### **1. Test Email Sending**

Run your application and trigger a password reset:

1. Go to forgot password page
2. Enter a **verified recipient email**
3. Check terminal for success logs:
    ```
    Password reset email sent successfully: abc123...
    ```

### **2. Check Email Delivery**

-   Check inbox of verified recipient
-   Look for email from "Your App Name <onboarding@resend.dev>"
-   Check spam folder if not in inbox

### **3. Terminal Debugging**

**✅ Success logs:**

```
Password reset email sent successfully: 2770ea00-ae86-4603-bd26-856aba4a9344
```

**❌ Error logs to watch for:**

```
Password reset email error: {
  statusCode: 403,
  message: 'The example.com domain is not verified'
}
```

---

## 🚫 **Common Issues & Solutions**

### **Issue 1: Domain Verification Error**

**Error:**

```
The ai-chat.app domain is not verified
```

**Solution:**

```env
# Change this in your .env file
EMAIL_FROM_ADDRESS=onboarding@resend.dev
# NOT: noreply@yourdomain.com
```

### **Issue 2: Emails Not Received**

**Causes & Solutions:**

1. **Recipient not verified**

    - Add email to verified recipients in Resend dashboard

2. **Wrong API key**

    - Check API key is correct and active

3. **Rate limiting**

    - Free accounts have sending limits

4. **Spam folder**
    - Check spam/junk folders

### **Issue 3: Invalid From Address**

**Error:**

```
Invalid from address
```

**Solution:**

-   Always use `onboarding@resend.dev`
-   Don't use your own domain unless verified

---

## 📊 **Free Account Limits**

Resend free account includes:

-   ✅ **3,000 emails/month**
-   ✅ **100 emails/day**
-   ✅ **1 verified domain** (resend.dev counts)
-   ✅ **Unlimited verified recipients**

Perfect for development and small projects!

---

## 🔄 **Production Migration**

When ready for production:

1. **Buy a domain** (if you don't have one)
2. **Add domain to Resend** dashboard
3. **Configure DNS records** as instructed
4. **Wait for verification** (usually minutes)
5. **Update environment variables:**
    ```env
    EMAIL_FROM_ADDRESS=noreply@yourdomain.com
    EMAIL_FROM_NAME=Your Production App
    NODE_ENV=production
    ```

---

## 🛠️ **Complete Example**

### **Backend .env File**

```env
# Database
DATABASE_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Email (Resend)
RESEND_API_KEY=re_BtVJJN8A_4S5fJ2K8N9qR6FwLc8Mn3Rt
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME=AI Chat Platform

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

### **Verification Checklist**

-   [ ] Resend account created
-   [ ] API key added to `.env`
-   [ ] `EMAIL_FROM_ADDRESS=onboarding@resend.dev`
-   [ ] Test email added as verified recipient
-   [ ] Backend server restarted
-   [ ] Password reset tested successfully

---

## 🎉 **Success!**

You should now be able to:

-   ✅ Send password reset emails
-   ✅ Send welcome emails
-   ✅ Send any transactional emails
-   ✅ Receive emails in verified inboxes

**No domain verification required!**

---

## 📞 **Support**

If you still have issues:

1. **Check Resend Dashboard** - Look for error logs
2. **Verify Recipients** - Ensure test emails are verified
3. **Check Terminal Logs** - Look for success/error messages
4. **Test with Different Email** - Try another verified recipient

---

**🏆 You're all set! Start sending emails without the domain hassle.**
