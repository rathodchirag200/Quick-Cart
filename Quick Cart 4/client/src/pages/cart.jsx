import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cartcontext";
import { AuthContext } from "../context/authcontext";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

export const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } =
    useContext(CartContext);
  const { token } = useContext(AuthContext);
  const API = import.meta.env.VITE_API_URL;

  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressError, setAddressError] = useState("");

  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Please login to view your cart.
        <NavLink to="/login" className="text-[#F15A24] ml-2 underline">
          Login
        </NavLink>
      </div>
    );
  }

  const cartItems = cart.items || [];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.02;

  const total = subtotal + tax;

  const fetchAddress = async () => {
    try {
      const res = await axios.get(`${API}/api/getaddress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddress(res.data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setAddressError("Please select a shipping address!");
      return;
    }
    setAddressError("");

    if (!cartItems.length) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${API}/api/orders/create`,
        {
          address: selectedAddress,
          items: cartItems.map((p) => ({
            productId: p.productId,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
            image: p.image[0],
          })),
          totalAmount: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data.order;

      const paymentRes = await axios.post(
        `${API}/api/payment/create`,
        { amount: total, orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, key } = paymentRes.data;

      const options = {
        key,
        amount: total * 100,
        currency: "INR",
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          await axios.post(
            `${API}/api/payment/verify`,
            {
              orderId: order._id,
              razorpayOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: total,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          clearCart();
          navigate("/my-orders");
          toast.success("Order placed successfully");
        },
        theme: { color: "#F15A24" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }
  };

  if (!cartItems.length) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Your cart is empty.
        <NavLink to="/" className="text-[#F15A24] ml-2 underline">
          Continue Shopping
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        
        <div className="w-full md:w-[48%]">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Your <span className="text-[#F15A24]">Cart</span>
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 pb-6 border-b"
            >
              <div className="flex gap-4 items-center">
                <div className="w-[90px] h-[90px] bg-gray-100 rounded overflow-hidden">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-[#F15A24] text-xs mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex items-center border rounded">
                <button
                  onClick={() => decreaseQuantity(item.productId)}
                  disabled={item.quantity === 1}
                  className="px-3 py-2"
                >
                  <img src="./minus.png" className="w-5 " alt=""/>
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item.productId)}
                  className="px-3 py-2"
                >
                <img src="./plus.png" className="w-5" alt=""/>
                </button>
              </div>

              <div className="font-semibold sm:ml-auto">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center text-[#F15A24] font-semibold mt-6">
            <NavLink to="/" className="flex items-center gap-2">
              <FaArrowLeftLong /> Continue Shopping
            </NavLink>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        <div className="w-full md:w-[48%] bg-gray-50 p-6 rounded-lg shadow mt-8 md:mt-0">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <label className="font-semibold">Select Address</label>
          <select
            className="w-full border p-2 rounded mt-2"
            onChange={(e) =>
              setSelectedAddress(address.find((a) => a._id === e.target.value))
            }
          >
            <option value="">-- Choose Address --</option>
            {address.map((a) => (
              <option key={a._id} value={a._id}>
                {a.fullName}, {a.city}
              </option>
            ))}
          </select>

          {addressError && (
            <p className="text-red-600 text-sm mt-1">{addressError}</p>
          )}

          <NavLink
            to="/address"
            className="block text-right text-[#F15A24] underline mt-2"
          >
            Add New
          </NavLink>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (2%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg border-t mt-4 pt-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#F15A24] text-white py-3 rounded mt-6 font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};
