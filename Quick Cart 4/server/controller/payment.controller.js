const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../model/Payment");
const Order = require("../model/Order");
const Refund = require("../model/refund");
const dotenv = require("dotenv");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.razorpay_test_apikey,
  key_secret: process.env.razorpay_testkey_secret,
});

const createpayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, orderId } = req.body;

    if (!amount || !orderId || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.razorpay_test_apikey,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, razorpayOrderId, paymentId, signature, amount, currency } =
      req.body;

    if (!razorpayOrderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Invalid payment details" });
    }

    const sign = razorpayOrderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.razorpay_testkey_secret)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Failed! Signature mismatch",
      });
    }

    await Payment.create({
      orderId,
      paymentId,
      amount,
      currency,
      signature,
      userId,
      status: "completed",
    });

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "processing",
      paymentId,
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const refundpayment = async (req, res) => {
  try {
    const { orderid } = req.params;

    const order = await Order.findById(orderid);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (!order.paymentId) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not found for this order" });
    }

    const existingRefund = await Refund.findOne({ orderId: order._id });
    if (existingRefund) {
      return res
        .status(400)
        .json({ success: false, message: "Refund already processed" });
    }

    if (order.orderStatus !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be refunded",
      });
    }

    const payment = await Payment.findOne({ orderId: order._id });
    if (payment.status !== "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not eligible for refund" });
    }

    const refund = await razorpay.payments.refund(order.paymentId, {
      amount: Math.round(order.totalAmount * 100),
      speed: "normal",
      receipt: `refund_${order._id}`,
    });

    await Refund.create({
      orderId: order._id,
      paymentId: order.paymentId,
      refundId: refund.id,
      userId: order.userId,
      refundAmount: refund.amount / 100,
    });

    order.paymentStatus = "refunded";
    await order.save();

    payment.status = "refunded";
    payment.refundId = refund.id;
    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (err) {
    console.error("Refund error:", err);
    return res.status(500).json({ success: false, message: "Refund failed" });
  }
};

module.exports = { createpayment, verifyPayment, refundpayment };
