const Cart = require("../model/Cart");
const Product = require("../model/Product");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "all fields required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            name: product.name,
            price: product.prise,
            image: product.images[0],
            quantity,
          },
        ],
      });
    } else {
      const existItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existItem) {
        existItem.quantity += 1;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.prise,
          image: product.images[0],
          quantity,
        });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const cart = await Cart.findOne({ userId });
    res.status(200).json({ cart: cart || { items: [] } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    if (userId) {
      console.log({ message: "userid is required" });
    }

    const { productId } = req.body;

    if (!productId) {
      console.log({ message: "productid is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    if (productId) {
      console.log("productid is required");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (item.quantity > 1) item.quantity -= 1;
    else
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );

    await cart.save();
    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
};
