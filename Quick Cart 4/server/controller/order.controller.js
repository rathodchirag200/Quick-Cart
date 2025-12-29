const Order = require("../model/Order");
const { findByIdAndUpdate } = require("../model/Product");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, items, totalAmount } = req.body;
    const orderid = "ORD-BSX-" + Date.now();

    if (!userId || !address || !items || !totalAmount || !orderid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
      userId,
      orderid,
      address,
      items,
      totalAmount,
      orderStatus: "pending",
      paymentStatus: "unpaid",
      paymentId: null,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const orderbyid = async (req, res) => {
  try {
    const userid = req.user._id;
    const order = await Order.find({ userId: userid });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internel server error" });
  }
};

const Orderstatus = async (req, res) => {
  try {
    const { orderid } = req.params;
    const { orderStatus } = req.body;

    if (!orderid) {
      return res
        .status(400)
        .json({ success: false, message: "orderid is required" });
    }

    if (!orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "orderStatus is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderid,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const Cancelorder = async (req, res) => {
  try {
    const { orderid } = req.params;
    const { orderStatus } = req.body;

    if (!orderid) {
      return res
        .status(400)
        .json({ success: false, message: "orderid is required" });
    }

    if (!orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "orderStatus is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderid,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status Cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  orderbyid,
  Orderstatus,
  Cancelorder,
};
