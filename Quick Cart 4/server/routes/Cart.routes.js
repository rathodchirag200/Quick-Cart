const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
} = require("../controller/Cart.controller");
const auth = require("../middlewear/auth");

router.post("/cart/add", auth, addToCart);
router.get("/cart", auth, getCart);
router.post("/cart/remove", auth, removeFromCart);
router.post("/cart/decrease", auth, decreaseQuantity);
router.post("/cart/clear", auth, clearCart);

module.exports = router;
