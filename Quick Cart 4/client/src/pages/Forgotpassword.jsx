import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setForgotEmail } = useContext(AuthContext);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API}/api/forggot-password`, { email });

      setForgotEmail(email);

      toast.success("OTP sent to your email");
      setEmail("");
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-1 text-sm text-center">
            Enter your registered email to receive a reset OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#fd522e] text-white font-semibold tracking-wide shadow-md hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-200"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex h-[px] bg-gray-200"></div>
          <span className="text-gray-400 text-xs text-center w-full">OR</span>
          <div className="flex h-[px] bg-gray-200"></div>
        </div>

        <div className="text-center">
          <NavLink
            to={"/login"}
            className="text-[#fd522e] font-medium hover:underline transition"
          >
            ← Back to Login
          </NavLink>
        </div>
      </div>

    </div>
  );
};
