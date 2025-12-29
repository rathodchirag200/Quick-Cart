import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refundLoadingId, setRefundLoadingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/orders/allorders"
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/orders/${id}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleRefund = async (id) => {
    try {
      setRefundLoadingId(id);

      await axios.post(
        `http://localhost:3000/api/payment/refund/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Refund processed successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, paymentStatus: "refunded" } : order
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Refund failed");
    } finally {
      setRefundLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <div className="orders w-full min-h-screen bg-gray-100 md:px-10 pt-[50px] pb-10">
      <div className="mb-8 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-gray-800">All Orders</h2>
        <p className="text-gray-500 mt-1">Manage all customer orders</p>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md border p-5 flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-bold text-gray-900 break-all">
                  {order.orderid}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-4 py-3 font-bold text-[17px] rounded-full text-xs font-semibold
                    ${order.orderStatus === "pending"
                      ? "bg-orange-200 text-orange-700"
                      : order.orderStatus === "processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-200 text-orange-700"
                    }`}
                >
                  {order.orderStatus}
                </span>

                <span
                  className={`px-4 py-3 font-bold text-[17px] rounded-full text-xs font-semibold
                  ${order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-red-100 text-gray-700"
                    }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {order.address && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 flex justify-between">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Shipping Address
                  </p>
                  <p>
                    <strong>Name:</strong> {order.address.fullName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.address.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address.address},{" "}
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.pin}
                  </p>
                </div>
                <div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleOrderStatus(order._id, e.target.value)
                    }
                    className="rounded-xl"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg border object-contain"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-gray-900 text-lg">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <p className="text-xl font-bold text-gray-900">
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>

              {order.orderStatus === "cancelled" && (
                <button
                  onClick={() => handleRefund(order._id)}
                  disabled={
                    order.paymentStatus === "refunded" ||
                    refundLoadingId === order._id
                  }
                  className={`px-3 py-2 font-bold text-white rounded-lg
                    ${order.paymentStatus === "refunded"
                      ? "bg-green-600 cursor-not-allowed"
                      : refundLoadingId === order._id
                        ? "bg-gray-500 cursor-wait"
                        : "bg-blue-600"
                    }
                   `}
                >
                  {refundLoadingId === order._id
                    ? "Processing..."
                    : order.paymentStatus === "refunded"
                      ? "Amount Refunded Successfully"
                      : "Refund"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
