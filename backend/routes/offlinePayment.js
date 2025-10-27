const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const {
  generateOTP,
  requestOTPFromESP32,
  canRequestOTP,
  getRemainingCooldown,
  storeOTPInFirebase,
  verifyOTPFromFirebase
} = require('../utils/otpService');
const { isESP32Online, getHardwareStatus } = require('../utils/hardwareStatus');

// @route   POST /api/offline-payment/generate-otp
// @desc    Generate OTP for offline payment (after user consent)
// @access  Private
router.post('/generate-otp', protect, async (req, res) => {
  try {
    console.log('Generate OTP request received:', { 
      userId: req.user._id.toString(), 
      cartLength: req.body.cart?.length,
      amount: req.body.amount 
    });
    
    const { cart, amount } = req.body;
    const userId = req.user._id.toString();

    if (!cart || cart.length === 0) {
      console.log('Error: Cart is empty');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check if ESP32 hardware is online
    console.log('Checking hardware status...');
    const hardwareOnline = await isESP32Online();
    console.log('Hardware online status:', hardwareOnline);
    
    if (!hardwareOnline) {
      const hardwareStatus = await getHardwareStatus();
      console.log('Hardware status:', hardwareStatus);
      return res.status(503).json({
        success: false,
        message: 'Hardware not connected. Please ensure the vending machine is online.',
        hardwareStatus: hardwareStatus
      });
    }

    // Check rate limiting (30 second cooldown)
    if (!canRequestOTP(userId)) {
      const remainingTime = getRemainingCooldown(userId);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
        remainingTime
      });
    }

    // Validate products and stock
    for (const item of cart) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }

    // Create pending transaction
    const transactionProducts = [];
    for (const item of cart) {
      const product = await Product.findById(item.product);
      transactionProducts.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      products: transactionProducts,
      totalAmount: amount,
      paymentMethod: 'Offline',
      status: 'Pending'
    });

    // Request OTP from ESP32 (ESP32 generates TOTP using RTC)
    console.log('Requesting OTP from ESP32...');
    let otp;
    try {
      otp = await requestOTPFromESP32();
      console.log('Received OTP from ESP32:', otp);
    } catch (otpError) {
      console.error('Error requesting OTP from ESP32:', otpError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP from hardware. Please try again.',
        error: otpError.message
      });
    }

    // Store OTP metadata in Firebase
    console.log('Storing OTP in Firebase...');
    let timestamp, expiryTime;
    try {
      const result = await storeOTPInFirebase(userId, otp, {
        amount,
        products: transactionProducts,
        orderId: transaction._id.toString()
      });
      timestamp = result.timestamp;
      expiryTime = result.expiryTime;
      console.log('OTP stored in Firebase successfully');
    } catch (firebaseError) {
      console.error('Error storing OTP in Firebase:', firebaseError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to store OTP. Please try again.',
        error: firebaseError.message
      });
    }

    // Prepare QR code data with Razorpay credentials for mobile app
    const qrData = {
      otp,
      amount,
      orderId: transaction._id.toString(),
      userId,
      timestamp,
      expiryTime,
      // Razorpay credentials for mobile app to process payment
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
        upiId: process.env.RAZORPAY_UPI_ID || 'merchant@razorpay'
      },
      // Backend webhook URL for payment confirmation
      webhookUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/webhooks/razorpay`,
      products: transactionProducts.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price
      }))
    };

    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        otp, // For display on screen
        qrData: JSON.stringify(qrData), // For QR code generation
        orderId: transaction._id,
        expiryTime,
        expiresIn: 300 // 5 minutes in seconds
      }
    });
  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OTP',
      error: error.message
    });
  }
});

// @route   POST /api/offline-payment/verify-otp
// @desc    Verify OTP entered by user
// @access  Private
router.post('/verify-otp', protect, async (req, res) => {
  try {
    const { otp, orderId } = req.body;
    const userId = req.user._id.toString();

    if (!otp || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'OTP and Order ID are required'
      });
    }

    // Verify OTP from Firebase
    const verificationResult = await verifyOTPFromFirebase(userId, otp);

    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Update transaction status
    const transaction = await Transaction.findById(orderId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to transaction'
      });
    }

    transaction.status = 'Completed';
    await transaction.save();

    // Update product quantities
    for (const item of transaction.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        product.isAvailable = product.quantity > 0;
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

// @route   GET /api/offline-payment/check-cooldown
// @desc    Check if user can request OTP
// @access  Private
router.get('/check-cooldown', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const canRequest = canRequestOTP(userId);
    const remainingTime = getRemainingCooldown(userId);

    res.status(200).json({
      success: true,
      data: {
        canRequest,
        remainingTime
      }
    });
  } catch (error) {
    console.error('Check cooldown error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check cooldown',
      error: error.message
    });
  }
});

// @route   GET /api/offline-payment/hardware-status
// @desc    Check if ESP32 hardware is online
// @access  Public
router.get('/hardware-status', async (req, res) => {
  try {
    const status = await getHardwareStatus();
    
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Hardware status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check hardware status',
      error: error.message
    });
  }
});

module.exports = router;
