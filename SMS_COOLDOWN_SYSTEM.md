# ⏱️ SMS Cooldown System - 3 Hour Limit

## ✅ **What Was Implemented**

SMS alerts for low stock products are now sent **only once every 3 hours** per product to avoid spam.

---

## 🎯 **How It Works**

### **Cooldown Logic:**

1. **First SMS** → Sent immediately ✅
2. **Cooldown Activated** → 3 hours ⏳
3. **Within 3 hours** → SMS blocked, log message shown
4. **After 3 hours** → SMS can be sent again ✅

### **Per Product Tracking:**

- Each product has its own cooldown timer
- Muskmelon cooldown ≠ Coca Cola cooldown
- Independent tracking for each product

---

## 📝 **Files Created/Modified**

### **New File:**
✅ `backend/utils/smsCooldown.js` - Cooldown manager

### **Modified Files:**
✅ `backend/services/notificationService.js` - Added cooldown check  
✅ `backend/routes/payment.js` - Pass productId, log cooldown  
✅ `backend/routes/offlinePayment.js` - Pass productId, log cooldown  
✅ `backend/routes/products.js` - Pass productId, log cooldown

---

## 🔔 **SMS Behavior**

### **Scenario 1: First Alert**
```
Product: Muskmelon (2 units)
Time: 1:00 PM
Result: ✅ SMS sent immediately
Log: "🚨 Low stock SMS sent for Muskmelon (2 left)"
```

### **Scenario 2: Within Cooldown**
```
Product: Muskmelon (1 unit) 
Time: 2:30 PM (1.5 hours later)
Result: ⏳ SMS blocked (cooldown active)
Log: "⏳ SMS cooldown active for Muskmelon (90 min remaining)"
```

### **Scenario 3: After Cooldown**
```
Product: Muskmelon (1 unit)
Time: 4:01 PM (3+ hours later)
Result: ✅ SMS sent again
Log: "🚨 Low stock SMS sent for Muskmelon (1 left)"
```

---

## 🧪 **Testing**

### **Test 1: First SMS**

1. **Restart backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Trigger low stock** (any method):
   - Buy Muskmelon until stock ≤ 3
   - OR edit Muskmelon in admin panel
   - OR click "Send Alert" in Analytics

3. **Check phone** → SMS received ✅

4. **Check backend logs**:
   ```
   ✅ SMS sent successfully: SM123... for Muskmelon
   📝 SMS cooldown recorded for product: 673abc... (3 hour cooldown active)
   ```

---

### **Test 2: Cooldown Block**

1. **Immediately trigger again** (within 3 hours):
   - Edit Muskmelon again
   - OR buy more Muskmelon
   - OR click "Send Alert"

2. **Check phone** → No SMS received ⏳

3. **Check backend logs**:
   ```
   ⏳ SMS cooldown active for Muskmelon. Can send again in 179 minutes.
   ⏳ SMS cooldown active for Muskmelon (179 min remaining)
   ```

---

### **Test 3: After Cooldown**

1. **Wait 3 hours** (or use test override below)

2. **Trigger again**:
   - Edit Muskmelon
   - OR buy Muskmelon

3. **Check phone** → SMS received again ✅

4. **Check backend logs**:
   ```
   ✅ SMS sent successfully: SM456... for Muskmelon
   📝 SMS cooldown recorded for product: 673abc... (3 hour cooldown active)
   ```

---

## 🔧 **Testing Without Waiting 3 Hours**

### **Option 1: Clear Cooldowns (Recommended)**

Add this route temporarily for testing:

```javascript
// In backend/routes/analytics.js
const smsCooldown = require('../utils/smsCooldown');

// Add this route (TESTING ONLY)
router.post('/reset-sms-cooldowns', protect, authorize('admin'), async (req, res) => {
  smsCooldown.clearAllCooldowns();
  res.json({ success: true, message: 'All SMS cooldowns cleared' });
});
```

Then call:
```bash
curl -X POST http://localhost:5000/api/analytics/reset-sms-cooldowns \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Option 2: Change Cooldown Period**

In `backend/utils/smsCooldown.js`:

```javascript
// Change from 3 hours to 1 minute for testing
const COOLDOWN_PERIOD = 1 * 60 * 1000; // 1 minute
```

---

## 📊 **Backend Logs**

### **SMS Sent:**
```
✅ SMS sent successfully: SM1234567890abcdef for Muskmelon
📝 SMS cooldown recorded for product: 673abc123def456 (3 hour cooldown active)
```

### **Cooldown Active:**
```
⏳ SMS cooldown active for Muskmelon. Can send again in 179 minutes.
⏳ SMS cooldown active for Muskmelon (179 min remaining)
```

### **Cooldown Expired:**
```
✅ SMS sent successfully: SM9876543210fedcba for Muskmelon
📝 SMS cooldown recorded for product: 673abc123def456 (3 hour cooldown active)
```

---

## 🎯 **Key Features**

✅ **Per-Product Cooldown** - Each product tracked separately  
✅ **3 Hour Period** - Prevents SMS spam  
✅ **Automatic Tracking** - No manual intervention needed  
✅ **Clear Logging** - See cooldown status in logs  
✅ **Memory-Based** - Fast, no database queries  
✅ **Restart Safe** - Cooldowns reset on server restart (by design)

---

## ⚠️ **Important Notes**

### **Cooldown Resets On:**
- ✅ Server restart
- ✅ Manual clear (if implemented)
- ❌ NOT on product update
- ❌ NOT on stock change

### **SMS Still Sent For:**
- ✅ Different products (independent cooldowns)
- ✅ Same product after 3 hours
- ✅ Manual "Send Alert" (respects cooldown)

### **SMS Blocked For:**
- ❌ Same product within 3 hours
- ❌ Multiple purchases of same product
- ❌ Multiple edits of same product

---

## 📋 **Cooldown Utility Functions**

Available in `backend/utils/smsCooldown.js`:

```javascript
// Check if SMS can be sent
canSendSMS(productId) // Returns true/false

// Get remaining cooldown time
getRemainingCooldown(productId) // Returns minutes

// Record SMS sent
recordSMSSent(productId) // Sets 3-hour cooldown

// Reset specific product
resetCooldown(productId) // Clear one product

// Reset all cooldowns
clearAllCooldowns() // Clear everything

// View active cooldowns
getActiveCooldowns() // Returns array of active cooldowns
```

---

## 🎉 **Summary**

**Before:**
- ❌ SMS sent every time stock ≤ 3
- ❌ Multiple SMS for same product
- ❌ SMS spam possible

**After:**
- ✅ SMS sent once per 3 hours per product
- ✅ Cooldown prevents spam
- ✅ Clear logging of cooldown status
- ✅ Independent tracking per product

---

**Restart backend and test! SMS will only be sent once every 3 hours per product!** 🚀
