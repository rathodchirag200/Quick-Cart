import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CartContext } from "../context/Cartcontext";
import { AuthContext } from "../context/authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Details = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/api/products/${id}`);
      setProduct(res.data.product);
      setSelectedImage(res.data.product.images[0]);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setisLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setTimeout(() => navigate("/login"), 300);
      return;
    }
    addToCart(product._id, 1);
  };

  const handleBuyNow = () => {
    if (!user) {
      setTimeout(() => navigate("/login"), 300);
      return;
    }
    addToCart(product._id, 1);
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="loader"></p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-red-500">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex flex-col gap-5 justify-center items-center w-full lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[350px] sm:h-[420px] object-contain"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-contain rounded-lg border-2 cursor-pointer ${
                  selectedImage === img
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
                alt=""
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 gap-5">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex text-orange-500">
              {[...Array(5)].map((_, i) =>
                i < Math.round(product.ratings) ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )
              )}
            </div>
            <span className="text-sm text-gray-500">({product.ratings}.0)</span>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-orange-600">
              ₹{product.offer_prise}
            </span>

            {product.prise > product.offer_prise && (
              <span className="line-through text-gray-400 text-lg">
                ₹{product.prise}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500">Brand:</span>
              <span className="font-semibold">{product.compny_name}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">Category:</span>
              <span className="font-semibold">{product.category}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
