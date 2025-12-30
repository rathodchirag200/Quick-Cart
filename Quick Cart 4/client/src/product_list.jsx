import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Confirmdelete } from "./modal/confirmdelete";
import { NavLink } from "react-router-dom";
import { Pagination } from "./Componenets/Pagination";

export const Product_list = () => {
  const [products, setProducts] = useState([]);
 const [isLoading, setisLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const token = localStorage.getItem("adminToken");
  const API = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    setisLoading(true);
    try {
      const response = await axios.get(
        `${API}/api/products?page=${currentPage}&limit=${itemsPerPage}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);



  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        await handleDelete(selectedProductId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== selectedProductId)
        );
      } catch (err) {
        console.error(err);
      }
    }
    setShowModal(false);
    setSelectedProductId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-[50px] px-4 md:px-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <NavLink to="/admin/home">
          <button className="bg-[#4743f8] text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform">
            + Add Product
          </button>
        </NavLink>
      </div>

      <div className="hidden md:flex items-center justify-center md:block  rounded-2xl  overflow-hidden">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-[#4743f8] text-white">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-indigo-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ID: {item._id.slice(0, 6)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 font-bold text-green-600">₹ {item.prise}</td>
                <td className="p-4">
                  <div className="flex gap-3 flex-wrap">
                    <NavLink to={`${item._id}`}>
                      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:scale-105 transition-transform">
                        Edit
                      </button>
                    </NavLink>
                    <button
                      onClick={() => {
                        setSelectedProductId(item._id);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:scale-105 transition-transform"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-6 md:hidden">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-bold text-green-600 mt-1">₹ {item.prise}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <NavLink to={`${item._id}`} className="w-1/2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:scale-105 transition-transform">
                  Edit
                </button>
              </NavLink>
              <button
                onClick={() => {
                  setSelectedProductId(item._id);
                  setShowModal(true);
                }}
                className="w-1/2 bg-red-600 text-white py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        setpage={setCurrentPage}
      />

      {showModal && (
        <Confirmdelete
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
