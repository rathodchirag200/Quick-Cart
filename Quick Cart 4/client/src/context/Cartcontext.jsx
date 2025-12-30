import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./authcontext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token} = useContext(AuthContext); 
  const [cart, setCart] = useState({ items: [] });
  const API = import.meta.env.VITE_API_URL;


  const fetchCart = async () => {
    if (!token){
     return setCart([]);
    };

    try {
      const res = await axios.get(`${API}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]); 


  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/cart/add`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
     return toast.success("Product added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add product");
    }
  };


  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${API}/api/cart/remove`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
     return toast.success("Product removed");
    } catch (err) {
      console.error("Remove cart error:", err);
      toast.error("Failed to remove");
    }
  };


  const decreaseQuantity = async (productId) => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${API}/api/cart/decrease`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
       return toast.success("Product removed from cart");
    } catch (err) {
      console.error("Decrease error:", err);
     return toast.error("Failed to decrease quantity");
    }
  };


  const clearCart = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${API}/api/cart/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
     return toast.success("Cart cleared");
    } catch (err) {
      console.error("Clear error:", err);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
