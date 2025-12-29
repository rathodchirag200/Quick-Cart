const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    refundId: {
      type: String, 
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refundAmount: {
      type: Number,
      required: true,
    },

    refundStatus: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },

    refundReason: {
      type: String,
      default: "Order Cancelled",
    },
  },
  { timestamps: true }
);

 const Refund = mongoose.model("Refund", RefundSchema);

 
module.exports = Refund;
