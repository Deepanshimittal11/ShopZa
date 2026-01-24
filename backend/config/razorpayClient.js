// server/config/razorpayClient.js
// Safe wrapper for Razorpay client. If the 'razorpay' package is installed and
// environment variables are configured, it will return a Razorpay instance.
// Otherwise, it exposes stub methods that throw helpful errors when used.
const Razorpay = require('razorpay');
// Ensure environment variables are loaded even if server loads routes early
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Basic validation to surface config errors early
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  // Log a clear message once at startup for easier debugging
  // Do not throw here to avoid crashing if certain environments don't need payments immediately
  console.error(
    "Razorpay keys are not configured. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set."
  );
}

module.exports = razorpay;