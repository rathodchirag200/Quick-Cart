import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email: values.email,
        password: values.password,
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);

        login(data.token);

        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/google-login",
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);

      login(res.data.token);

      toast.success("Google login successful");
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-100 px-4 py-30">
      <div className="w-full max-w-[430px] bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-gray-600 mb-1 font-medium">
                  Password
                </label>

                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                />

                <span
                  className="absolute right-3 top-[41px] cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="text-right text-sm mt-1">
                <NavLink
                  to="/forgot-password"
                  className="text-orange-600 hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-bold text-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center flex gap-2 justify-center text-gray-600 mt-5">
          <span>Don't have an account?</span>
          <NavLink to="/register">
            <span className="text-orange-600 font-semibold hover:underline">
              Register
            </span>
          </NavLink>
        </p>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
};
