import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaStar } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";


export const Headphone = () => {
  const [products, setProducts] = useState([]);
  const naviagate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
       const headphoneProducts = res.data.products.filter(product => product.category === "Headphone");
      setProducts(headphoneProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const Gotoproduct = (id) =>{
    naviagate(`/products/${id}`)
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      className="cards4 w-full px-4 pl-10 pr-10  sm:px-6 md:px-10 py-10"
    >
      <h2 className="text-2xl flex items-center justify-center font-semibold underline decoration-3 decoration-amber-600 underline-offset-8 mb-6">
        Headphones
      </h2>

      <div
        className="
        cards
          grid
          grid-cols-5
          gap-6
          justify-center
        "
      >
        {products.map((item) => (
          <div
            key={item._id}
            className="
            cards2
              bg-white rounded-xl shadow-md p-4 
              hover:shadow-xl transition-all duration-300
              relative
              w-[275px]
            "
          >
            <div 
            onClick={()=> Gotoproduct(item._id)}
            className="cards3 w-full h-[180px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={`${API}/${item.images[0]}`}
                alt={item.name}
                className=" h-full object-contain 
                          transition-transform duration-300 ease-in-out
                          hover:scale-110
                          cursor-pointer"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-center items-center gap-1 py-1 rounded-sm w-[50px] bg-[#388e3c]  mt-2">
              <span className="text-sm text-white font-medium">
                {item.ratings}.3
              </span>
              <FaStar className="text-white w-3 h-3" />
            </div>
            <div className="flex gap-5 justify-between items-center">
              <div className="mt-3 font-bold text-lg">${item.prise}</div>

              <button
              onClick={()=> Gotoproduct(item._id)}
                className="
                mt-4 px-8  py-2 rounded-2xl 
                border border-gray-400 
                hover:bg-gray-100 transition
              "
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
