import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Otpmodal } from "../modal/otpmodal";
import { AuthContext } from "../context/authcontext";

export const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [image, setimage] = useState(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (!image) {
        toast.error("Please upload a profile image");
        return;
      }

      const formdata = new FormData();
      formdata.append("username", values.username);
      formdata.append("email", values.email);
      formdata.append("password", values.password);
      formdata.append("image", image);

      try {
        const response = await axios.post(
          `${API}/api/register`,
          formdata,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data) {
          // ✅ save token
          localStorage.setItem("token", response.data.token);

          // ✅ auth context
          login(response.data.token);

          // OTP modal
          setOtpEmail(values.email);
          setIsOtpOpen(true);

          toast.success("User registered successfully");
        }

        resetForm();
        setInitialValues({
          username: "",
          email: "",
          password: "",
        });
        setimage(null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handlePhotoChange = (e) => {
    setimage(e.target.files[0]);
  };

  const closeOtpModal = () => {
    setIsOtpOpen(false);
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API}/api/google-login`,
        {
          token: credentialResponse.credential,
        }
      );

      // ✅ save token
      localStorage.setItem("token", res.data.token);

      // ✅ auth context
      login(res.data.token);

      toast.success("Google login successful");

      // ✅ redirect to home
      navigate("/");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-100 px-4 py-30">
      <div className="w-full max-w-[430px] bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-700 mb-6">
          Create Account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
            />

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover mt-3 mx-auto shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition rounded-lg font-bold text-lg"
          >
            Register
          </button>
        </form>

        <p className="flex gap-2 text-center justify-center items-center text-gray-600 mt-5">
          <span>Already have an account?</span>
          <NavLink to={"/login"}>
            <span className="text-orange-600 font-semibold hover:underline">
              Login
            </span>
          </NavLink>
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
          />
        </div>
      </div>

      {isOtpOpen && <Otpmodal closeModal={closeOtpModal} email={otpEmail} />}
    </div>
  );
};
