# 🚀 Pre-Deployment Checklist

## ✅ **All Enhancements Implemented**

### **Admin Dashboard:**
- ✅ Analytics Dashboard with charts (Revenue, Products, Categories, Peak Hours)
- ✅ User Management tab with statistics
- ✅ Low Stock Alert Banner (top of dashboard)
- ✅ SMS notification system (3-hour cooldown)
- ✅ Enhanced product management

### **User Dashboard:**
- ✅ Order History modal
- ✅ Quantity restriction (can't buy more than available)
- ✅ Professional UI improvements

### **Backend:**
- ✅ Analytics service and routes
- ✅ Notification service with SMS cooldown
- ✅ Automatic SMS alerts when stock ≤3
- ✅ SMS cooldown system (3 hours per product)

---

## ⚠️ **CRITICAL: Before Deployment**

### **1. Change API URLs from Localhost to Production**

All frontend files currently use `http://localhost:5000`. You MUST change these to your production URL.

**Files to Update (19 occurrences):**
1. `frontend/src/pages/AdminDashboard.jsx` (6 URLs)
2. `frontend/src/pages/OfflinePayment.jsx` (3 URLs)
3. `frontend/src/components/AnalyticsDashboard.jsx` (2 URLs)
4. `frontend/src/components/UserManagement.jsx` (2 URLs)
5. `frontend/src/pages/Cart.jsx` (2 URLs)
6. `frontend/src/components/OrderHistory.jsx` (1 URL)
7. `frontend/src/pages/Login.jsx` (1 URL)
8. `frontend/src/pages/Register.jsx` (1 URL)
9. `frontend/src/pages/UserDashboard.jsx` (1 URL)

**Find and Replace:**
```
Find: http://localhost:5000
Replace: https://your-backend-url.onrender.com
```

---

### **2. Update Backend CORS**

In `backend/server.js`, update CORS to allow your production frontend:

```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-url.onrender.com',
    'https://your-frontend-url.vercel.app'
  ],
  optionsSuccessStatus: 200,
  credentials: true
};
```

---

### **3. Environment Variables**

**Backend `.env` (DO NOT commit this file):**
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=vending_machine_secret_key_2025
RAZORPAY_KEY_ID=rzp_test_RP2Hw84XTNJuAk
RAZORPAY_KEY_SECRET=sgCMKhSpxPbK1FLbSsFjN258
FIREBASE_DATABASE_URL=https://vending-machine-18-default-rtdb.firebaseio.com
RAZORPAY_UPI_ID=merchant@razorpay
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Twilio SMS (Optional - for production)
TWILIO_ACCOUNT_SID=AC3139385454e205cbffc8345394d92070
TWILIO_AUTH_TOKEN=029b31367e5a85da97c35399c6027df8
TWILIO_PHONE_NUMBER=+18144581122
ADMIN_PHONE=+918946094723
ADMIN_EMAIL=sabeelmohamedcm2023cce@sece.ac.in
```

**Add these to Render/Vercel Environment Variables!**

---

### **4. Install Missing Dependencies**

**Frontend:**
```bash
cd frontend
npm install recharts
npm install
```

**Backend:**
```bash
cd backend
npm install
```

---

## 🧪 **Local Testing Checklist**

### **Backend Tests:**
- [ ] Server starts without errors (`npm start`)
- [ ] MongoDB connects successfully
- [ ] Firebase initializes
- [ ] Twilio initializes (check logs)
- [ ] All routes accessible:
  - [ ] `/api/products`
  - [ ] `/api/transactions`
  - [ ] `/api/analytics/*`
  - [ ] `/api/auth/*`

### **Frontend Tests:**
- [ ] Frontend starts (`npm run dev`)
- [ ] No console errors
- [ ] Can login as admin
- [ ] Can login as user

### **Admin Dashboard Tests:**
- [ ] Analytics tab loads with charts
- [ ] Products tab shows all products
- [ ] Can add/edit/delete products
- [ ] Transactions tab shows history
- [ ] Users tab shows user list
- [ ] Low stock banner appears (if products ≤3)
- [ ] "Manage Stock" button works

### **User Dashboard Tests:**
- [ ] Products display correctly
- [ ] Can add to cart
- [ ] Quantity restriction works (can't exceed stock)
- [ ] Alert shows when trying to exceed stock
- [ ] Order History button works
- [ ] Order History modal shows past orders
- [ ] Can view order details

### **Payment Tests:**
- [ ] Online payment works (Razorpay)
- [ ] Cart shows correct totals
- [ ] Payment success redirects correctly

### **Low Stock System Tests:**
- [ ] Products with ≤3 units show in banner
- [ ] Editing product with ≤3 units triggers check
- [ ] Purchasing product to ≤3 units triggers check
- [ ] SMS cooldown works (3 hours)
- [ ] Backend logs show SMS status

---

## 📦 **Deployment Steps**

### **Step 1: Prepare Code**

1. **Update all API URLs** (localhost → production)
2. **Update CORS** in `server.js`
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Prepare for deployment: Update API URLs and CORS"
   git push origin main
   ```

### **Step 2: Deploy Backend (Render)**

1. Go to Render Dashboard
2. Select your backend service
3. **Add Environment Variables:**
   - All variables from `.env` file
   - Make sure `ADMIN_PHONE` is set correctly
4. Click "Manual Deploy" → "Deploy latest commit"
5. Wait for deployment
6. Test: `https://your-backend.onrender.com/health`

### **Step 3: Deploy Frontend (Render/Vercel)**

1. Go to your frontend hosting
2. Deploy latest commit
3. Wait for deployment
4. Test: Open your frontend URL

### **Step 4: Verify Deployment**

- [ ] Frontend loads without errors
- [ ] Can login as admin
- [ ] Can login as user
- [ ] Analytics dashboard works
- [ ] All features functional
- [ ] Check browser console for errors

---

## 🐛 **Common Deployment Issues**

### **Issue 1: CORS Error**
**Symptom:** "Access to fetch has been blocked by CORS policy"
**Solution:** Update CORS origins in `server.js` with production URLs

### **Issue 2: Environment Variables Not Loaded**
**Symptom:** Features not working, "undefined" in logs
**Solution:** Add all env vars to Render/Vercel dashboard

### **Issue 3: 404 on API Calls**
**Symptom:** API calls return 404
**Solution:** Verify API URLs are updated to production URL

### **Issue 4: Charts Not Showing**
**Symptom:** Analytics tab is blank
**Solution:** Ensure `recharts` is installed in `package.json`

### **Issue 5: SMS Not Working**
**Symptom:** No SMS received
**Solution:** 
- Verify Twilio credentials in environment variables
- Check phone number is verified in Twilio
- Check backend logs for errors

---

## 📋 **Files Modified Summary**

### **Backend (New Files):**
- `services/analyticsService.js`
- `services/notificationService.js`
- `routes/analytics.js`
- `utils/smsCooldown.js`

### **Backend (Modified):**
- `server.js` (added analytics route)
- `routes/payment.js` (SMS alerts)
- `routes/offlinePayment.js` (SMS alerts)
- `routes/products.js` (SMS alerts)

### **Frontend (New Files):**
- `components/AnalyticsDashboard.jsx`
- `components/UserManagement.jsx`
- `components/OrderHistory.jsx`

### **Frontend (Modified):**
- `pages/AdminDashboard.jsx` (tabs, low stock banner)
- `pages/UserDashboard.jsx` (quantity restriction, order history)

---

## ✅ **Final Checklist Before Deploy**

- [ ] All API URLs changed to production
- [ ] CORS updated with production URLs
- [ ] Environment variables documented
- [ ] Dependencies installed
- [ ] Local testing completed
- [ ] No console errors
- [ ] Git committed and pushed
- [ ] Ready to deploy!

---

## 🎯 **Post-Deployment Verification**

After deployment, test these:

1. **Login** (admin and user)
2. **View Analytics** (charts load)
3. **Add Product** (works)
4. **Buy Product** (payment works)
5. **Check Low Stock Banner** (appears if needed)
6. **View Order History** (shows orders)
7. **Test Quantity Restriction** (can't exceed stock)

---

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in Render
3. Verify environment variables are set
4. Check CORS configuration

---

**Everything is ready! Just update the URLs and deploy!** 🚀
