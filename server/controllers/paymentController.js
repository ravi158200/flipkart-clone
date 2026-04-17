const crypto = require('crypto');
const Order = require('../models/Order');
let razorpay;
try {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_5gghf7D0U2M9T9',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_flipkart_vault_123'
    });
} catch (libErr) {
    console.error('CRITICAL: Razorpay Library not found. Run "npm install razorpay"');
}

// Create Razorpay Order (POST /api/payment/order)
const createRazorpayOrder = async (req, res) => {
    if (!razorpay) {
        return res.status(500).json({ 
            message: 'Razorpay vault logic is currently offline.', 
            detail: 'The "razorpay" library is not installed in the backend. Run "npm install razorpay" in the server folder and restart.'
        });
    }
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (err) {
        console.error('Razorpay Order Creation Error:', err);
        res.status(500).json({ message: 'Could not resolve transaction with Razorpay Vault.', error: err.message });
    }
};

// Verify Razorpay Payment (POST /api/payment/verify)
const verifyPayment = async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        orderPayload 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_flipkart_vault_123')
        .update(body.toString())
        .digest("hex");

    const isVerified = expectedSignature === razorpay_signature;

    if (isVerified) {
        // Signature verified, now save the ACTUAL order in our database
        try {
            const order = new Order({
                ...orderPayload,
                user: req.user._id,
                isPaid: true,
                paymentMethod: 'Razorpay Secure Vault',
                paymentResult: {
                    id: razorpay_payment_id,
                    status: 'Captured',
                    update_time: new Date().toISOString(),
                    signature: razorpay_signature
                }
            });

            const createdOrder = await order.save();
            res.status(200).json({ 
                success: true, 
                message: "RAZORPAY VERIFICATION SUCCESS: Transaction settled.",
                order: createdOrder
            });
        } catch (dbErr) {
            console.error('Order Save Error after Payment:', dbErr);
            res.status(500).json({ success: false, message: 'Payment verified but order logging failed.' });
        }
    } else {
        res.status(400).json({ success: false, message: "RAZORPAY VERIFICATION FAILED: Signature mismatch." });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};
