import React, { useContext, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

export const Changepassword = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required("Old password required")
      .min(6, "Min 6 characters"),

    newPassword: Yup.string()
      .required("New password required")
      .min(6, "Min 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/change-password`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      if (res.data.success) {
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-center text-xl font-bold mb-4">Change Password</h2>

        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          {({ errors }) => (
            <Form className="space-y-4">
              <div>
                <label>Old Password</label>
                <Field
                  type="password"
                  name="oldPassword"
                  className="w-full p-2 border rounded"
                />
                <div className="text-red-500 text-sm">{errors.oldPassword}</div>
              </div>

              <div>
                <label>New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full p-2 border rounded"
                />
                <div className="text-red-500 text-sm">{errors.newPassword}</div>
              </div>

              <div>
                <label>Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full p-2 border rounded"
                />
                <div className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f54900] text-white py-2 rounded"
              >
                {loading ? "Processing..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
