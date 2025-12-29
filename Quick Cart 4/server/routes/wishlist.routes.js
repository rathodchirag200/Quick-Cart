const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/wishlist.contrller");
const auth = require("../middlewear/auth");

router.post("/add", auth ,  addToWishlist);
router.post("/remove",  auth , removeFromWishlist);
router.get("/mywishlist", auth , getWishlist);

module.exports = router;
