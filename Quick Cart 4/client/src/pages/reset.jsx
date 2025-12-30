import React, { useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

export const Reset = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const { forgotEmail, setForgotEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("No email found. Please request OTP first.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const verifyRes = await axios.post(
        `${API}/api/verifyotp`,
        { email: forgotEmail, otp }
      );

      if (verifyRes.data.success) {
        const resetRes = await axios.post(
          `${API}/api/reset-password`,
          {
            email: forgotEmail,
            otp,
            newPassword,
            confirmPassword,
          }
        );

        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        setOtp("");
        setNewPassword("");
        setConfirmPassword("");

        setForgotEmail("");
      } else {
        toast.error(verifyRes.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">
              OTP
            </label>
            <input
              type="number"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-[#fd522e] hover:bg-[#cc2503] focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};
