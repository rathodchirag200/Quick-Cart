import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Invoicepdf } from "../Componenets/Invoicepdf";

export const My_Order = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const admintoken = localStorage.getItem("adminToken");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.order);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
      }
    };
    if (token) fetchUserOrders();
  }, [token]);

  const handleorderstatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${API}/api/cancelorder/${id}`,
        { orderStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id
            ? { ...order, orderStatus: res.data.order.orderStatus }
            : order
        )
      );
    } catch (err) {
      console.log("Error updating order status:", err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center text-lg mt-10">
          You have no orders yet.
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-lg overflow-hidden mb-8 border border-gray-200"
          >
            <div className="above bg-gray-50 p-4 border-b flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{order.orderid}</p>

                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">
                    Order Date: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </p>

                <p className="text-sm text-gray-600">Payment: Razorpay</p>
              </div>

              <div className="process flex gap-2 items-center">
                <span className="text-lg font-semibold">Status :</span>
                <span className="border px-3 py-2 rounded-lg text-lg font-semibold text-green-600">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="below flex items-center justify-between border-b pb-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 object-contain rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Price:{" "}
                        <span className="font-medium">₹{item.price}</span>
                      </p>
                      <p className="text-gray-600 flex gap-1 text-sm">
                        Quantity:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="total text-right text-sm text-gray-500">
                    <p>Total</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex cancel items-center justify-between p-4 pb-[10px]">
              {order.orderStatus !== "shipped" && order.orderStatus !== "delivered" && (
                <button
                  onClick={() => handleorderstatus(order._id, "cancelled")}
                  disabled={order.orderStatus === "cancelled"}
                  className={`cancelb px-2 py-2 text-white font-bold ${order.orderStatus === "cancelled"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600"
                    }`}
                >
                  {order.orderStatus === "cancelled" ? "Order Cancelled" : "Cancel Order"}
                </button>
              )}





              <div className="">
                <PDFDownloadLink
                  className="bg-[#ea580c]  invoice text-white font-bold px-2 py-2"
                  document={<Invoicepdf order={order} />}
                  fileName={`invoice_${order.orderid}.pdf`}
                >
                  {({ loading }) =>
                    loading ? "Generating..." : "Download Invoice"
                  }
                </PDFDownloadLink>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
};
