const Wishlist = require("../model/wishlist");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      return res.json({ success: false, message: "Already in wishlist" });
    }

    const wishlist = new Wishlist({ userId, productId });
    await wishlist.save();

    res.json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res.status(400).json({ success: false, message: "userid is required" });
    }
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, mesage: "productId is required" });
    }

    await Wishlist.findOneAndDelete({ userId, productId });

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res.status(400).json({ success: false, mesage: "userid is required" });
    }

    const list = await Wishlist.find({ userId }).populate("productId");

    const safeList = list.filter((item) => item.productId);

    res.json({ success: true, wishlist: safeList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
