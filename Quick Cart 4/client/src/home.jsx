import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Home = () => {
  const [images, setImages] = useState([]);
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const [initialValues, setInitialValues] = useState({
    name: "",
    compny: "",
    description: "",
    category: "Earphone",
    prise: "",
    offer_prise: "",
    ratings: "",
    bestseller: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);


  useEffect(() => {
    if (editId) {
      const token = localStorage.getItem("adminToken");
      axios
        .get(`${API}/api/products/${editId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const product = res.data.product;
          setInitialValues({
            name: product.name,
            compny: product.compny_name,
            description: product.description,
            category: product.category,
            prise: product.prise,
            offer_prise: product.offer_prise,
            ratings: product.ratings,
            bestseller: product.bestseller,
          });
          setImages(product.images || []);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch product data");
        });
    }
  }, [editId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    compny: Yup.string().required("Company Name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    prise: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required"),
    offer_prise: Yup.number()
      .typeError("Offer Price must be a number")
      .required("Offer Price is required"),
    ratings: Yup.number()
      .typeError("Ratings must be a number")
      .min(0, "Min 0")
      .max(5, "Max 5")
      .required("Ratings are required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("compny_name", values.compny);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("prise", values.prise);
      formData.append("offer_prise", values.offer_prise);
      formData.append("ratings", values.ratings);
      formData.append("bestseller", values.bestseller);

      images.forEach((img) => {
        if (editId) {
          if (img instanceof File) {
          
            formData.append("images", img);
          } else {
           
            formData.append("oldImages", img);
          }
        } else {
         
          formData.append("images", img);
        }
      });


      if (editId) {
        await axios.put(
          `${API}/api/products/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Product updated successfully!");
        setTimeout(() => {
          navigate("/admin/products");
        }, 500);
        return;
      } else {
        await axios.post(`${API}/api/addproducts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Product added successfully!");
      }

      resetForm();
      setImages([]);
    } catch (error) {
      console.error(error.response || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <ToastContainer />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="max-w-[1400px] border-[#d1d5db] px-10 flex flex-col gap-8 pt-[40px] ml-[13px] pb-10">
            <h1 className="text-3xl font-bold text-gray-800 text-center w-full">
              {editId ? "Edit Product" : "Add Product"}
            </h1>

            <h1 className="text-xl font-semibold">Product Images</h1>
            <div className="uploaded-image flex items-center gap-4 flex-wrap">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-[150px] h-[85px] border border-dashed border-gray-400 rounded bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={
                      typeof img === "string"
                        ? img
                        : URL.createObjectURL(img)
                    }
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <label className="relative w-[150px] h-[85px] border border-dashed border-gray-400 rounded bg-gray-100 flex items-center justify-center cursor-pointer">
                <span>
                  <img src="./upload area.png" alt="" />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <Field
                type="text"
                name="name"
                placeholder="Product Name"
                className="border w-full md:w-[427px] px-4 h-[50px] rounded-sm border-[#c4c7cc]"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Field
                type="text"
                name="compny"
                placeholder="Company Name"
                className="border w-full md:w-[427px] px-4 h-[50px] rounded-sm border-[#c4c7cc]"
              />
              <ErrorMessage
                name="compny"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="border w-full md:w-[427px] px-4 h-[150px] rounded-sm border-[#c4c7cc]"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Field
                as="select"
                name="category"
                className="border w-full md:w-[427px] px-4 h-[50px] rounded-sm border-[#c4c7cc]"
              >
                <option>Earphone</option>
                <option>Headphone</option>
                <option>Watch</option>
                <option>SmartWatch</option>
                <option>Laptop</option>
                <option>Camera</option>
                <option>Accessories</option>
                <option>Smartphone</option>
                <option>Speaker</option>
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <Field
                  type="number"
                  name="prise"
                  placeholder="Price"
                  className="border w-[150px] h-[50px] px-3 border-[#c4c7cc]"
                />
                <ErrorMessage
                  name="prise"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Field
                  type="number"
                  name="offer_prise"
                  placeholder="Offer Price"
                  className="border w-[150px] h-[50px] px-3 border-[#c4c7cc]"
                />
                <ErrorMessage
                  name="offer_prise"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Field
                  type="number"
                  name="ratings"
                  placeholder="Ratings"
                  className="border w-[150px] h-[50px] px-3 border-[#c4c7cc]"
                />
                <ErrorMessage
                  name="ratings"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="bestseller" id="bestseller" />
              <label htmlFor="bestseller">Bestseller</label>
            </div>

            <button
              type="submit"
              className="w-32 h-[45px] hover:bg-[#f66d23] bg-[#ea580c] text-white text-[17px] font-bold rounded"
            >
              {editId ? "Update" : "Add"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
