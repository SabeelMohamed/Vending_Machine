# 🔧 Localhost Configuration Complete

## ✅ All API URLs Changed to Localhost

All API endpoints have been updated from **Render deployment** to **localhost** for local development.

---

## 📝 Changes Made

### **Frontend Files Updated** (19 occurrences):

1. ✅ **AnalyticsDashboard.jsx** (2 changes)
   - Analytics API base URL
   - Low stock notification endpoint

2. ✅ **UserManagement.jsx** (2 changes)
   - Users list endpoint
   - User stats endpoint

3. ✅ **OrderHistory.jsx** (1 change)
   - User transactions endpoint

4. ✅ **AdminDashboard.jsx** (6 changes)
   - Products fetch
   - Transactions fetch
   - Stats fetch
   - Product delete
   - Product create/update

5. ✅ **UserDashboard.jsx** (1 change)
   - Products fetch

6. ✅ **Login.jsx** (1 change)
   - Login endpoint

7. ✅ **Register.jsx** (1 change)
   - Signup endpoint

8. ✅ **Cart.jsx** (2 changes)
   - Create order endpoint
   - Verify payment endpoint

9. ✅ **OfflinePayment.jsx** (3 changes)
   - Hardware status check
   - Generate OTP
   - Verify OTP

### **Backend Files Updated**:

1. ✅ **server.js** (CORS configuration)
   - Changed from Render URLs to localhost
   - Added support for ports: 5173, 3000
   - Added credentials support

---

## 🌐 API Configuration

### **Old URLs** (Render):
```
https://vending-machine-r93c.onrender.com/api/*
```

### **New URLs** (Localhost):
```
http://localhost:5000/api/*
```

---

## 🚀 How to Run Locally

### **1. Start Backend Server**
```bash
cd backend
npm install
npm start
```
Backend will run on: **http://localhost:5000**

### **2. Start Frontend Server**
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: **http://localhost:5173** (Vite default)

### **3. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔧 CORS Configuration

Backend now accepts requests from:
- ✅ `http://localhost:5173` (Vite default)
- ✅ `http://localhost:3000` (React default)
- ✅ `http://127.0.0.1:5173`
- ✅ `http://127.0.0.1:3000`

---

## 📋 All API Endpoints (Localhost)

### **Authentication**
- `POST http://localhost:5000/api/auth/login`
- `POST http://localhost:5000/api/auth/signup`

### **Products**
- `GET http://localhost:5000/api/products`
- `POST http://localhost:5000/api/products`
- `PUT http://localhost:5000/api/products/:id`
- `DELETE http://localhost:5000/api/products/:id`

### **Transactions**
- `GET http://localhost:5000/api/transactions`
- `GET http://localhost:5000/api/transactions/user`
- `GET http://localhost:5000/api/transactions/stats`
- `POST http://localhost:5000/api/transactions`

### **Payment**
- `POST http://localhost:5000/api/payment/create-order`
- `POST http://localhost:5000/api/payment/verify`

### **Offline Payment**
- `GET http://localhost:5000/api/offline-payment/hardware-status`
- `POST http://localhost:5000/api/offline-payment/generate-otp`
- `POST http://localhost:5000/api/offline-payment/verify-otp`

### **Analytics** (NEW)
- `GET http://localhost:5000/api/analytics/revenue-trends`
- `GET http://localhost:5000/api/analytics/product-performance`
- `GET http://localhost:5000/api/analytics/category-distribution`
- `GET http://localhost:5000/api/analytics/peak-hours`
- `GET http://localhost:5000/api/analytics/comparison`
- `GET http://localhost:5000/api/analytics/low-stock`
- `POST http://localhost:5000/api/analytics/notify-low-stock`
- `GET http://localhost:5000/api/analytics/user-stats`
- `GET http://localhost:5000/api/analytics/users`

### **Webhooks**
- `POST http://localhost:5000/api/webhooks/razorpay`

---

## ✅ Testing Checklist

After starting both servers, test these features:

### **Authentication**
- [ ] Login as user
- [ ] Login as admin
- [ ] Register new user

### **User Dashboard**
- [ ] View products
- [ ] Add to cart
- [ ] View order history
- [ ] Online payment
- [ ] Offline payment

### **Admin Dashboard**
- [ ] View analytics tab
- [ ] View products tab
- [ ] Add/Edit/Delete products
- [ ] View transactions
- [ ] View users tab
- [ ] Send low stock alerts

---

## 🔄 Switching Back to Production

If you need to deploy to production again, you'll need to:

1. **Update all API URLs** back to your production URL
2. **Update CORS** in `backend/server.js` to production domains
3. **Deploy** to Render/Vercel

Or create an **environment variable** approach:

### **Better Approach: Use Environment Variables**

Create `.env` in frontend:
```env
VITE_API_URL=http://localhost:5000
```

Then use in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/products`)
```

---

## 🎯 Current Status

✅ **All API calls now point to localhost:5000**
✅ **CORS configured for local development**
✅ **Ready for local testing and development**

---

## 🚨 Important Notes

1. **MongoDB Connection**: Ensure your MongoDB is running (local or Atlas)
2. **Environment Variables**: Check `backend/.env` has correct MongoDB URI
3. **Port 5000**: Make sure port 5000 is not in use by another application
4. **Razorpay**: Test keys are already configured in the code

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Backend Logs**: Look for errors in terminal running `npm start`
2. **Check Frontend Console**: Open browser DevTools → Console
3. **Verify MongoDB**: Ensure database connection is successful
4. **Check Ports**: Ensure 5000 and 5173 are available

---

**All set for local development! 🚀**
