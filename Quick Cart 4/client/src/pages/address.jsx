import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/authcontext";
import { useNavigate, useParams } from "react-router-dom";

export const Address = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    phone: "",
    pin: "",
    address: "",
    city: "",
    state: "",
  });

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    pin: Yup.string()
      .required("Pin code is required")
      .matches(/^[0-9]{6}$/, "Pin code must be 6 digits"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.address;
        setInitialValues({
          fullName: data.fullName || "",
          phone: data.phone || "",
          pin: data.pin || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
        });
      })
      .catch(() => toast.error("Failed to fetch address"));
  }, [id, token]);

  const handleSubmit = async (values) => {
    if (!token) return toast.error("Please login first");

    setLoading(true);
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/address/${id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Address updated successfully");
        navigate("/alladdress");
        return;
      } else {
        await axios.post("http://localhost:3000/api/address", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Address saved successfully");
      }
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to save address");
    }
    setLoading(false);
  };

  return (
    <div className="w-full bg-white px-6 py-20">
      <ToastContainer />

      {/* MAIN WRAPPER */}
      <div
        className="
          flex 
          items-center 
          justify-center 
          gap-[250px] 
          w-full
          max-[1100px]:flex-col
          max-[1100px]:gap-16
        "
      >
        {/* FORM */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            {id ? "Edit" : "Add"} Shipping{" "}
            <span className="text-orange-500">Address</span>
          </h2>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="mt-6 w-[500px] max-[600px]:w-full space-y-4">
              <Field
                name="fullName"
                placeholder="Full Name"
                className="w-full border border-gray-300 px-4 py-3 rounded"
              />
              <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />

              <Field
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 px-4 py-3 rounded"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />

              <Field
                name="pin"
                placeholder="Pincode"
                className="w-full border border-gray-300 px-4 py-3 rounded"
              />
              <ErrorMessage name="pin" component="div" className="text-red-500 text-sm" />

              <Field
                as="textarea"
                name="address"
                rows="3"
                placeholder="Address (Area & Street)"
                className="w-full border border-gray-300 px-4 py-3 rounded"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />

              {/* CITY & STATE */}
              <div className="flex gap-4 max-[500px]:flex-col">
                <div className="w-full">
                  <Field
                    name="city"
                    placeholder="City/District/Town"
                    className="w-full border border-gray-300 px-4 py-3 rounded"
                  />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="w-full">
                  <Field
                    name="state"
                    placeholder="State"
                    className="w-full border border-gray-300 px-4 py-3 rounded"
                  />
                  <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded text-lg font-semibold hover:bg-orange-600 transition"
              >
                {loading ? "Processing..." : id ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
              </button>
            </Form>
          </Formik>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center items-center max-[1100px]:mt-10">
          <img
            src="/loaction.svg"
            alt="location"
            className="w-80 md:w-96"
          />
        </div>
      </div>
    </div>
  );
};
