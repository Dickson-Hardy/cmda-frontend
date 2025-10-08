# PayPal Sandbox Test Credentials

## Quick Setup (Copy-Paste Ready)

### 1. Update Frontend .env

Add this to `CMDA-Frontend/.env`:
```env
# PayPal Sandbox Configuration
VITE_PAYPAL_MODE="sandbox"

# Get your sandbox Client ID from: https://developer.paypal.com/dashboard/
# Navigate to: Apps & Credentials → Sandbox tab
VITE_PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID_HERE"
```

### 2. Update Backend .env

Add this to `CMDA-Backend/.env`:
```env
# PayPal Sandbox Configuration
PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID"
PAYPAL_CLIENT_SECRET="YOUR_SANDBOX_SECRET"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
```

### 3. Get Sandbox Credentials

**Steps:**
1. Go to: https://developer.paypal.com/dashboard/
2. Log in with your PayPal account
3. Click **"Apps & Credentials"** in top menu
4. Click **"Sandbox"** tab
5. Click **"Create App"** (or use "Default Application")
6. Copy **Client ID** and **Secret**

### 4. Get Test Accounts

**Steps:**
1. In PayPal Developer Dashboard
2. Click **"Accounts"** under Sandbox menu
3. You'll see 2 accounts auto-created:

**Business Account (Merchant - Receives Money):**
```
Type: Business
Email: sb-xxxxxx@business.example.com
Password: (click "View/Edit Account" to see)
Balance: $9,999.88 USD
```

**Personal Account (Buyer - Sends Money):**
```
Type: Personal  
Email: sb-xxxxxx@personal.example.com
Password: (click "View/Edit Account" to see)
Balance: $9,999.88 USD
```

## Testing Payment Flow

### Test 1: Subscription Payment

```javascript
// 1. Login to your app as Global Network user
// 2. Navigate to: Payments → Subscribe Now
// 3. Select income bracket: "Less than $50,000"
// 4. Select frequency: Annual ($100)
// 5. Click PayPal button
// 6. PayPal popup opens

// 7. Login with Sandbox Personal Account:
Email: sb-xxxxxx@personal.example.com (from dashboard)
Password: ******** (from dashboard)

// 8. Click "Complete Purchase"
// 9. Should redirect to: /dashboard/payments/successful?type=subscription&source=paypal&reference=ORDER_ID
// 10. Check backend logs for payment confirmation
```

### Test 2: Donation Payment

```javascript
// 1. Navigate to: Payments → Donations tab
// 2. Click "Make a Donation"
// 3. Select areas of need and amounts
// 4. Total amount shows (e.g., $50)
// 5. Click PayPal button
// 6. Login with sandbox account
// 7. Complete payment
// 8. Redirects to success page with donation confirmation
```

### Test 3: Store Purchase

```javascript
// 1. Add products to cart
// 2. Navigate to checkout
// 3. Fill shipping details:
//    Name: John Doe
//    Phone: +1234567890
//    Email: test@example.com
//    Address: 123 Test Street, Lagos
// 4. Click PayPal button
// 5. Login with sandbox account
// 6. Complete payment
// 7. Redirects to: /dashboard/store/orders/successful?source=paypal&reference=ORDER_ID
```

## Test Card Numbers (Guest Checkout)

If your sandbox allows card payments without PayPal account:

### Visa - Success
```
Card Number: 4032039854262525
Expiry: 01/2026
CVV: 123
Billing Zip: 12345
```

### Mastercard - Success
```
Card Number: 5425233430109903
Expiry: 01/2026
CVV: 123
Billing Zip: 12345
```

### Visa - 3D Secure (Authentication Required)
```
Card Number: 4000002500003155
Expiry: 01/2026
CVV: 123
```

## Verification Checklist

After payment, verify:

### Frontend:
- [ ] Redirected to success page
- [ ] Order ID/reference in URL
- [ ] Success message displayed
- [ ] User can see transaction in payment history

### Backend Console Logs:
- [ ] "Order created: ORDER_ID"
- [ ] "Payment confirmed for order: ORDER_ID"
- [ ] Email sent confirmation

### PayPal Sandbox Dashboard:
- [ ] Login to: https://www.sandbox.paypal.com
- [ ] Use **Business Account** credentials
- [ ] See transaction in account activity
- [ ] Status shows "Completed"
- [ ] Amount matches

### Database:
- [ ] Order/subscription record created
- [ ] Payment status: "completed" or "paid"
- [ ] Transaction reference stored
- [ ] User subscription activated (if subscription)

## Visual Indicator

When in sandbox mode, you'll see a blue banner above PayPal button:
```
🧪 Sandbox Mode - Test payments only
```

This helps you know you're not making real payments!

## Troubleshooting

### PayPal Button Not Showing
```bash
# Check console for errors
# Should see: Loading PayPal SDK with sandbox environment

# Verify .env has:
VITE_PAYPAL_MODE="sandbox"
VITE_PAYPAL_CLIENT_ID="AeA..." (sandbox ID)
```

### "Account Locked" Error
```bash
# In PayPal Developer Dashboard:
1. Go to Accounts
2. Click on locked account
3. Click "Reset Password"
4. Use new password to login
```

### Insufficient Funds
```bash
# In PayPal Developer Dashboard:
1. Go to Accounts
2. Click on account
3. Click "Set Balance"
4. Add $10,000.00
5. Save
```

### Payment Not Confirming on Backend
```bash
# Check backend API URL:
echo $PAYPAL_API_URL
# Should be: https://api-m.sandbox.paypal.com

# Check backend logs for errors
# Common issue: Using production API URL with sandbox credentials
```

## Example Success URLs

After payment, you should be redirected to:

**Subscription:**
```
http://localhost:5173/dashboard/payments/successful?type=subscription&source=paypal&reference=8V123456789
```

**Donation:**
```
http://localhost:5173/dashboard/payments/successful?type=donation&source=paypal&reference=8V987654321
```

**Store Order:**
```
http://localhost:5173/dashboard/store/orders/successful?source=paypal&reference=8V555666777
```

**Event:**
```
http://localhost:5173/dashboard/events/summer-conference?payment=successful&reference=8V111222333&source=PAYPAL
```

## Switching to Production

When ready to accept real payments:

**Frontend `.env`:**
```env
# Comment out sandbox mode
# VITE_PAYPAL_MODE="sandbox"

# Or explicitly set to production
VITE_PAYPAL_MODE="production"

# Use production Client ID
VITE_PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"
```

**Backend `.env`:**
```env
PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"
PAYPAL_CLIENT_SECRET="YOUR_PRODUCTION_SECRET"
PAYPAL_API_URL="https://api-m.paypal.com"
```

## Resources

- **Get Credentials:** https://developer.paypal.com/dashboard/
- **Sandbox Login:** https://www.sandbox.paypal.com
- **Test Cards:** https://developer.paypal.com/tools/sandbox/card-testing/
- **API Docs:** https://developer.paypal.com/docs/api/orders/v2/

---

**Happy Testing! 🎉** Remember: Sandbox = Fake Money, No Real Charges!
