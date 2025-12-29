import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/Cartcontext";
import { AuthProvider } from "./context/authcontext";
import { WishlistProvider } from "./context/WishlistContext";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
