import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/authcontext";

export const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/login",
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);

        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/admin/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="w-full  flex items-center justify-center  px-4 py-30">
      <div className="w-full max-w-[430px] bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-700 mb-6">
          Admin Login
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-600 mb-1 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
            <span
              className="absolute right-3 top-[41px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 
            transition rounded-lg font-bold text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
