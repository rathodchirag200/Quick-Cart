import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext"; // adjust path

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);


  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      const bestproducts = res.data.products;
      setProducts(bestproducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  
  const goToProduct = (id) => {
    navigate(`/products/${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="cards4 w-full px-4 pl-10 pr-10 sm:px-6 md:px-10 py-10">
      <h2 className="text-2xl flex items-center justify-center font-semibold underline decoration-3 decoration-amber-600 underline-offset-8 mb-6">
        All Products
      </h2>

      <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {products.map((item) => (
          <div
            key={item._id}
            className="cards2 bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 relative w-[275px]"
          >

            <div className="bg-white right-5 top-5 w-10 h-10 rounded-full flex justify-center items-center absolute cursor-pointer shadow">
              <button onClick={() => toggleWishlist(item._id)}>
                {isInWishlist(item._id) ? (
                  <FaHeart className="w-6 h-6 text-red-600 hover:scale-125 transition-transform duration-200" />
                ) : (
                  <FaRegHeart className="w-6 h-6 text-gray-400 hover:scale-125 transition-transform duration-200" />
                )}
              </button>
            </div>


            <div
              onClick={() => goToProduct(item._id)}
              className="cards3 w-full h-[180px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={`http://localhost:3000/${item.images[0]}`}
                alt={item.name}
                className="object-contain transition-transform duration-300 ease-in-out hover:scale-110 w-[150px] h-[150px]"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.description}
            </p>

  
            <div className="flex justify-center items-center gap-1 py-1 rounded-sm w-[50px] bg-[#388e3c] mt-2">
              <span className="text-sm text-white font-medium">
                {item.ratings}.3
              </span>
              <FaStar className="text-white w-3 h-3" />
            </div>


            <div className="flex gap-5 justify-between items-center mt-2">
              <div className="mt-3 font-bold text-lg">${item.prise}</div>
              <button
                onClick={() => goToProduct(item._id)}
                className="mt-4 px-8 py-2 rounded-2xl border border-gray-400 hover:bg-gray-100 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
