# 🔧 Authentication Issues Debugging Guide

## 🎯 **Current Issue**

Getting 400 (Bad Request) on registration and 401 (Unauthorized) on login from frontend, even though backend API works fine with curl.

## 🔍 **Debugging Steps**

### **Step 1: Check Console Logs**

I've added detailed logging to `src/services/authService.ts`. Open your browser's DevTools Console and try to register/login to see:

1. **Registration attempt data** - What data is being sent
2. **Response status** - HTTP status code
3. **Response headers** - CORS and other headers
4. **Response data** - Actual API response

### **Step 2: Common Issues & Solutions**

#### **Issue 1: Empty Form Fields**

**Symptoms**: 400 Bad Request with "Validation failed"

**Check**: Look in console for the registration data. Make sure all required fields are filled:

```javascript
// Should see something like:
🚀 Registration attempt with data: {
  email: "user@example.com",
  password: "Test123!@#",
  firstName: "John",
  lastName: "Doe"
}
```

**Fix**: If any field is empty or undefined, check the form state management.

#### **Issue 2: Password Validation**

**Symptoms**: 400 Bad Request with password validation error

**Requirements**: Password must have:

-   At least 8 characters
-   One uppercase letter
-   One lowercase letter
-   One number
-   One special character

**Test Password**: `Test123!@#`

#### **Issue 3: CORS Issues**

**Symptoms**: Network errors or blocked requests

**Check**: Look for CORS-related errors in console
**Solution**: Backend already configured for ports 5173-5179

#### **Issue 4: Incorrect API Endpoint**

**Symptoms**: 404 Not Found

**Check**: Console should show requests to `http://localhost:3001/api/auth/register`
**Fix**: Verify backend is running on port 3001

### **Step 3: Manual Testing**

#### **Test Backend Directly**

```bash
# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"Test123!@#","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"Test123!@#"}'
```

#### **Test with Valid Data in Frontend**

Use these test credentials:

-   **Email**: `test@example.com`
-   **Password**: `Test123!@#`
-   **First Name**: `Test`
-   **Last Name**: `User`

### **Step 4: Check Browser Network Tab**

1. Open **DevTools** → **Network Tab**
2. Try to register/login
3. Look for the API requests to `/api/auth/register` or `/api/auth/login`
4. Check:
    - **Request Headers**: Should include `Content-Type: application/json`
    - **Request Payload**: Should contain all form data
    - **Response**: Check status code and response body

### **Step 5: Verification Checklist**

#### **Backend Status** ✅

-   [ ] Backend running on port 3001
-   [ ] Database connected (MongoDB)
-   [ ] No TypeScript errors in backend console
-   [ ] CORS configured for frontend ports

#### **Frontend Status** ✅

-   [ ] Frontend running (any port 5173-5179)
-   [ ] No TypeScript errors in browser console
-   [ ] AuthService pointing to correct API URL
-   [ ] Form data being captured correctly

### **Step 6: Common Fixes**

#### **Fix 1: Clear Browser Storage**

```javascript
// Run in browser console to clear all stored data
localStorage.clear();
sessionStorage.clear();
```

#### **Fix 2: Restart Both Servers**

```bash
# Terminal 1: Restart backend
cd backend && npm run dev

# Terminal 2: Restart frontend
npm run dev
```

#### **Fix 3: Check Form State**

Add this to your form component to debug:

```javascript
console.log('Form data before submit:', formData);
```

### **Step 7: Expected Console Output**

#### **Successful Registration**

```
🚀 Registration attempt with data: {email: "...", password: "...", firstName: "...", lastName: "..."}
📡 Response status: 201
📦 Response data: {success: true, message: "User registered successfully", data: {...}}
```

#### **Successful Login**

```
🔐 Login attempt with data: {email: "...", password: "[REDACTED]"}
📡 Response status: 200
📦 Response data: {success: true, message: "Login successful", data: {...}}
```

## 🚨 **Most Likely Issues**

### **1. Form Validation**

Check if all required fields are filled and password meets requirements.

### **2. Browser Cache**

Clear browser storage and try again.

### **3. Server Sync**

Make sure both frontend and backend are running the latest code.

### **4. Environment Variables**

Check if `.env` file exists in backend with correct MongoDB URL.

## 📞 **Next Steps**

1. **Try the authentication** with the added logging
2. **Share the console output** you see when attempting to register/login
3. **Check the Network tab** for actual HTTP requests/responses
4. **Try the curl commands** to verify backend is working

The detailed logs will show us exactly what's happening and where the issue is occurring!

## 🔧 **Quick Test Script**

Run this in browser console to test API directly:

```javascript
// Test registration directly from browser
fetch('http://localhost:3001/api/auth/register', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		email: 'browser-test@example.com',
		password: 'Test123!@#',
		firstName: 'Browser',
		lastName: 'Test',
	}),
})
	.then((r) => r.json())
	.then((d) => console.log('Direct API test:', d))
	.catch((e) => console.error('Direct API error:', e));
```
