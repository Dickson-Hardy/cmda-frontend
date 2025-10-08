# PayPal Testing Guide - Sandbox Setup

## Current Setup: Production Mode ⚠️

Your current PayPal Client ID is **production** which means:
- Real money transactions
- Actual PayPal accounts required
- Charges real credit cards

## Switch to Sandbox for Testing

### Step 1: Get Sandbox Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal account
3. Navigate to **Apps & Credentials**
4. Switch to **Sandbox** tab (top of page)
5. Click **Create App** (or use default app)
6. Copy the **Client ID** (starts with something like `AeA...` or `Ab...`)

### Step 2: Update .env File

**Replace in `.env`:**
```env
# Production (current - for real payments)
# VITE_PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"

# Sandbox (for testing - use this)
VITE_PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID_HERE"
VITE_PAYPAL_MODE="sandbox"
```

### Step 3: Update PayPal Button Component

Update `PaypalPaymentButton.jsx` to use sandbox mode:

```jsx
const PaypalPaymentButton = ({ createOrder, onApprove, currency = "USD", amount }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const mode = import.meta.env.VITE_PAYPAL_MODE || "production"; // Add this
  const [key, setKey] = useState(0);

  // ... existing code ...

  return (
    <PayPalScriptProvider
      key={key}
      options={{
        clientId,
        currency,
        intent: "capture",
        disableFunding: "card,credit",
        vault: false,
        // Add environment based on mode
        ...(mode === "sandbox" && { environment: "sandbox" }),
      }}
      deferLoading={false}
    >
      <PayPalButtonWrapper createOrder={createOrder} onApprove={onApprove} currency={currency} />
    </PayPalScriptProvider>
  );
};
```

## PayPal Sandbox Test Accounts

Once you have sandbox credentials, PayPal automatically creates test accounts for you.

### Finding Your Test Accounts:

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Click **Accounts** under **Sandbox** in left menu
3. You'll see 2 default accounts:
   - **Business Account** (merchant - receives payments)
   - **Personal Account** (buyer - makes payments)

### Test Account Details:

Click on any account → **View/Edit Account** to see:
- Email: `sb-xxxxx@business.example.com`
- Password: (shown in dashboard)
- Balance: $9,999.88 USD (fake money)

## Testing Payment Flow

### Method 1: Using Test Personal Account

1. Click PayPal button on your site
2. PayPal login popup appears
3. **Use Sandbox Personal Account credentials:**
   ```
   Email: sb-xxxxx@personal.example.com
   Password: (from dashboard)
   ```
4. Complete payment with fake money
5. Payment approved ✅
6. See redirect/success behavior

### Method 2: Using Test Card (Guest Checkout)

If sandbox allows guest checkout, you can use these test cards:

**Visa (Approved):**
```
Card Number: 4032039854262525
Expiry: 01/2026
CVV: 123
```

**Visa (3D Secure - Requires Authentication):**
```
Card Number: 4000002500003155
Expiry: 01/2026
CVV: 123
```

**Mastercard (Approved):**
```
Card Number: 5425233430109903
Expiry: 01/2026
CVV: 123
```

**Card Testing Scenarios:**
- **Approved:** Payment goes through successfully
- **3D Secure:** Shows authentication popup, then approves
- **Declined:** Simulates card rejection

### Test Scenarios to Check:

#### 1. Successful Payment
- [ ] Click PayPal button
- [ ] Log in with sandbox personal account
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Check transaction ID in URL
- [ ] Verify backend received order confirmation
- [ ] Check email notifications sent

#### 2. Payment Cancellation
- [ ] Click PayPal button
- [ ] Log in to PayPal
- [ ] Click "Cancel and Return"
- [ ] Verify user returned to original page
- [ ] No order created

#### 3. Payment Error
- [ ] Use invalid/insufficient funds account
- [ ] See error handling
- [ ] User-friendly error message shown

#### 4. Different Amounts
- [ ] Small amount (< $5)
- [ ] Medium amount ($5-$100)
- [ ] Large amount (> $100)
- [ ] Verify amounts displayed correctly in PayPal popup

## Backend Configuration

Your backend also needs sandbox configuration:

**In CMDA-Backend `.env`:**
```env
# Sandbox
PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID"
PAYPAL_CLIENT_SECRET="YOUR_SANDBOX_SECRET"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"

# Production (comment out for testing)
# PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"
# PAYPAL_CLIENT_SECRET="YOUR_PRODUCTION_SECRET"
# PAYPAL_API_URL="https://api-m.paypal.com"
```

## Verifying Sandbox Mode is Active

### Frontend Check:
Open browser console and check PayPal SDK URL:
```
Should contain: &env=sandbox
Production would have: &env=production
```

### Backend Check:
Look at PayPal API calls - should go to:
```
✅ Sandbox: https://api-m.sandbox.paypal.com
❌ Production: https://api-m.paypal.com
```

## Testing Different Payment Types

### 1. Subscription Payment
- Navigate to Payments → Subscribe Now
- Select income bracket
- Click PayPal button
- Log in with sandbox account
- **Expected:** Subscription order created, redirects to success page

### 2. Donation Payment
- Navigate to Payments → Donations tab
- Click "Make a Donation"
- Enter amounts
- Click PayPal button
- **Expected:** Donation order created, success redirect

### 3. Store Order Payment
- Add products to cart
- Go to checkout
- Fill shipping details
- Click PayPal button
- **Expected:** Order created with products, success redirect

### 4. Event Registration Payment
- Navigate to Events
- Select paid event
- Click Register
- Click PayPal button
- **Expected:** Event registration + payment, confirmation email

## Monitoring Sandbox Transactions

### PayPal Dashboard:
1. Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
2. Click on **Business Account**
3. Click **View Account** (opens sandbox PayPal)
4. See all test transactions
5. View transaction details

### Your Application Logs:
Check backend console for:
```
POST /api/subscriptions/init → Returns order ID
POST /api/paypal/order/:orderId → Confirms payment
```

## Common Testing Issues

### Issue 1: "Account Locked" in Sandbox
**Solution:** Go to dashboard, click account → **Reset Password**

### Issue 2: Insufficient Funds
**Solution:** Sandbox accounts start with $9,999.88. If depleted:
1. Go to Dashboard → Accounts
2. Click account → **Set Balance**
3. Add more fake money

### Issue 3: Payment Not Completing
**Solution:** 
- Check backend logs for errors
- Verify API URL is sandbox
- Ensure order ID is being returned

### Issue 4: Redirect Not Working
**Solution:**
- Check `onApprove` callback
- Verify success URL includes order ID
- Check browser console for errors

## Quick Start Test Script

```bash
# 1. Get sandbox credentials from PayPal Developer Dashboard

# 2. Update .env
echo 'VITE_PAYPAL_CLIENT_ID="YOUR_SANDBOX_CLIENT_ID"' >> .env
echo 'VITE_PAYPAL_MODE="sandbox"' >> .env

# 3. Restart dev server
npm run dev

# 4. Test subscription payment
# - Login as Global Network user
# - Click Subscribe Now
# - Select income bracket
# - Click PayPal button
# - Login with sandbox personal account: sb-xxxxx@personal.example.com
# - Complete payment
# - Verify success page shown

# 5. Check backend logs
# Should see: "Payment confirmed for order: XXXXX"
```

## Switching Back to Production

When ready for production:

**Frontend `.env`:**
```env
VITE_PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"
VITE_PAYPAL_MODE="production"
```

**Backend `.env`:**
```env
PAYPAL_CLIENT_ID="AVxCHqrf5iA3G8mv21_qIx_ht4mRRLDWW48pkYwq-ColsbeviS5GL0XKonX-fLNrhWamB_fRDtQGwAWk"
PAYPAL_CLIENT_SECRET="YOUR_PRODUCTION_SECRET"
PAYPAL_API_URL="https://api-m.paypal.com"
```

## Testing Checklist

Before deploying to production, test all scenarios in sandbox:

- [ ] Subscription payment (monthly)
- [ ] Subscription payment (annual)
- [ ] Lifetime membership payment
- [ ] Donation (one-time)
- [ ] Donation (recurring/vision partner)
- [ ] Store order (single product)
- [ ] Store order (multiple products)
- [ ] Event registration (free event)
- [ ] Event registration (paid event)
- [ ] Conference registration (early bird)
- [ ] Conference registration (regular)
- [ ] Payment cancellation
- [ ] Payment error handling
- [ ] Success page redirect
- [ ] Email notifications
- [ ] Transaction ID stored in database
- [ ] Order status updated correctly

## Resources

- [PayPal Sandbox Guide](https://developer.paypal.com/docs/api-basics/sandbox/)
- [PayPal Test Cards](https://developer.paypal.com/tools/sandbox/card-testing/)
- [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
- [Testing Webhooks](https://developer.paypal.com/api/rest/webhooks/)

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify PayPal dashboard for transaction details
4. Check order ID is being passed correctly
5. Ensure backend confirms payment via PayPal API

---

**Remember:** Sandbox payments use **fake money** and **test accounts**. No real transactions occur! 🎉
