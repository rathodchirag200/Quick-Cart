import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token, logout } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setWishlist([]);
      return;
    }

    loadWishlist();
  }, [token]);

  const loadWishlist = async () => {
    try {
      const res = await axios.get(`${API}/api/mywishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data.wishlist.map((w) => String(w.productId._id));
      setWishlist(ids);
    } catch (err) {
      console.log("Wishlist load error:", err);

      if (err.response?.status === 403) {
        logout();
        navigate("/login");
        toast.error("You are blocked by admin");
      }
    }
  };

const toggleWishlist = async (productId) => {
  if (!token) {
    navigate("/login");
    return;
  }

  const pid = String(productId);

  try {
    if (wishlist.includes(pid)) {
      await axios.post(
        `${API}/api/remove`,
        { productId: pid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist((prev) => prev.filter((id) => id !== pid));
      toast.info("Removed from wishlist");
    } else {
      await axios.post(
        `${API}/api/add`,
        { productId: pid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist((prev) => [...prev, pid]);
      toast.success("Added to wishlist");
    }
  } catch (err) {
    console.log("Wishlist toggle error:", err);

    if (err.response?.status === 401) {
      logout();
      navigate("/login");
      return;
    }

    if (err.response?.status === 403) {
      toast.error("You are blocked by admin");
      logout();
      navigate("/login");
      return;
    }


    toast.error("Something went wrong!");
  }
};

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
