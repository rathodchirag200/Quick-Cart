import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaStar, FaRegHeart } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { WishlistContext } from "../context/WishlistContext";
import { Pagination } from "../Componenets/Pagination";

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setCategory(urlCategory.split(","));
    }
  }, []);

  useEffect(() => {
    if (category.length > 0) {
      setSearchParams({ category: category.join(",") });
    } else {
      setSearchParams({});
    }
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API}/api/products?page=${currentPage}&search=${searchItem}&category=${category}`
        );
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchItem, category]);

  const toggleCategory = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  const Gotoproduct = (id) => navigate(`/products/${id}`);

  return (
    <div className="cards4 w-full px-4 sm:px-6 md:px-10 py-10">
      <h2 className="text-2xl flex items-center justify-center font-semibold underline decoration-3 decoration-amber-600 underline-offset-8 mb-6">
        All Products
      </h2>


      <div className="flex max-w-[550px] mx-auto items-center justify-center mb-6 relative">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchItem}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-xl px-5 py-2 w-[550px] focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <img
          src="/search.png"
          className="absolute right-3 top-5 transform -translate-y-1/2 w-5 h-5"
          alt="Search"
        />
      </div>


      {isLoading && (
        <div className="flex justify-center items-center h-[300px]">
          <p className="loader"></p>
        </div>
      )}

      {!isLoading && products.length === 0 ? (
        <div className="text-center text-lg font-semibold mt-10">
          No products found
        </div>
      ) : (
        !isLoading && (
          <>
            <div className="flex shopcategory gap-5">
              <div className="flex flex-col gap-5">
                <h1 className="text-xl font-bold">Categories</h1>

                <div className="w-[200px] cat h-auto p-[15px] border-black border list-none">
                  {[
                    "Earphone",
                    "Headphone",
                    "SmartWatch",
                    "Laptop",
                    "Camera",
                    "Speaker",
                    "Smartphone",
                  ].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={category.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="cards grid grid-cols-5 gap-6 justify-center">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="cards2 bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 relative w-[275px]"
                  >
                    <div className="bg-white right-5 top-5 w-10 h-10 rounded-full flex justify-center items-center absolute cursor-pointer shadow">
                      <button onClick={() => toggleWishlist(item._id)}>
                        {wishlist.includes(item._id) ? (
                          <FaHeart className="w-6 h-6 text-red-600" />
                        ) : (
                          <FaRegHeart className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    <div
                      onClick={() => Gotoproduct(item._id)}
                      className="w-full h-[180px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="object-contain w-[150px] h-[150px]"
                      />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-center items-center gap-1 py-1 rounded-sm w-[50px] bg-[#388e3c] mt-2">
                      <span className="text-sm text-white font-medium">
                        {item.ratings}
                      </span>
                      <FaStar className="text-white w-3 h-3" />
                    </div>

                    <div className="flex gap-5 justify-between items-center">
                      <div className="mt-3 font-bold text-lg">
                        ${item.prise}
                      </div>

                      <button
                        onClick={() => Gotoproduct(item._id)}
                        className="mt-4 px-8 py-2 rounded-2xl border border-gray-400"
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              setpage={setCurrentPage}
            />
          </>
        )
      )}
    </div>
  );
};
