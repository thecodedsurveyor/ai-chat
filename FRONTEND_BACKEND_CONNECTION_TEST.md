# 🔧 Frontend-Backend Connection Test Guide

## 🎯 **Issue Diagnosis**

The "Invalid email or password" error is occurring because the frontend cannot detect the backend and is falling back to mock authentication.

---

## ✅ **Backend Status**

-   ✅ Health endpoint: `http://localhost:3001/api/health`
-   ✅ Auth endpoints working
-   ✅ Database connected
-   ✅ Test users created

---

## 🧪 **Test Users Available**

Use these credentials to test login:

### **User 1:**

-   **Email**: `test@example.com`
-   **Password**: `Test123!`

### **User 2:**

-   **Email**: `user@test.com`
-   **Password**: `Test123!`

---

## 🔍 **Frontend Testing Steps**

### **Step 1: Clear Browser Cache**

1. Open your browser's Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Clear **Local Storage** and **Session Storage**
4. Refresh the page

### **Step 2: Check Backend Detection**

1. Open Developer Tools → **Console**
2. Look for this message when you load the page:
    ```
    [AUTH] Backend available - using real API
    ```
    or
    ```
    [AUTH] Backend unavailable - using mock system
    ```

### **Step 3: Test Health Endpoint**

1. In the browser console, run:
    ```javascript
    fetch('http://localhost:3001/api/health')
    	.then((r) => r.json())
    	.then(console.log);
    ```
2. You should see:
    ```json
    {
    	"success": true,
    	"message": "API is running",
    	"timestamp": "2025-05-31T...",
    	"database": "connected"
    }
    ```

### **Step 4: Manual API Test**

1. In the browser console, test the login directly:
    ```javascript
    fetch('http://localhost:3001/api/auth/login', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify({
    		email: 'user@test.com',
    		password: 'Test123!',
    	}),
    })
    	.then((r) => r.json())
    	.then(console.log);
    ```

---

## 🔧 **Troubleshooting**

### **If Backend Shows as Unavailable:**

1. **Check CORS**: Make sure there are no CORS errors in console
2. **Check Network Tab**: Look for failed requests to `/api/health`
3. **Try Different Port**: The frontend might be running on a different port

### **If Still Getting Mock Authentication:**

1. **Force Refresh**: Press `Ctrl+F5` or `Cmd+Shift+R`
2. **Check Local Storage**: Look for any cached backend status
3. **Restart Frontend**: Stop and restart the Vite dev server

---

## 🚀 **Quick Fix Commands**

Run these in your terminal:

```bash
# 1. Restart Frontend (in main directory)
npm run dev

# 2. Test Backend Health (in separate terminal)
curl http://localhost:3001/api/health

# 3. Test Login API (in separate terminal)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Test123!"}'
```

---

## 📊 **Expected Behavior**

### **Correct Flow:**

1. Frontend loads → Checks `/api/health` → Backend detected ✅
2. User enters credentials → Sent to `/api/auth/login` → Real authentication ✅
3. Successful login → JWT token received → User logged in ✅

### **Current Issue:**

1. Frontend loads → `/api/health` fails → Backend not detected ❌
2. User enters credentials → Mock authentication used ❌
3. Mock users don't match your credentials → "Invalid email or password" ❌

---

## 🎯 **What to Test Now**

1. **Open**: http://localhost:5176/ (your frontend)
2. **Open Browser Console**: Check for backend detection message
3. **Try Login**: Use `user@test.com` / `Test123!`
4. **Check Console**: Look for API calls to localhost:3001

**The health endpoint fix should resolve the issue immediately!**

---

## 📞 **Still Having Issues?**

If the problem persists:

1. Share the browser console output
2. Check the Network tab for failed requests
3. Verify the frontend is on the correct port (5176)
4. Confirm backend is running on port 3001
