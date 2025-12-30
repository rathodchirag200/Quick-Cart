import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

export const Showaddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API}/api/getaddress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(res.data.addresses || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching address:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const handleEdit = (id) => {
    navigate(`/address/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto mt-10 px-4 mb-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Saved Addresses
      </h2>

      {addresses.length === 0 && (
        <p className="text-center text-gray-500">No addresses found.</p>
      )}

    
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2
        lg:grid-cols-4 
        gap-6
      ">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="
              bg-white 
              rounded-2xl 
              shadow-md 
              p-6 
              border 
              border-gray-200
            "
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {address.fullName}
            </h3>

            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Phone:</span> {address.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {address.address}
              </p>
              <p>
                <span className="font-semibold">City:</span> {address.city}
              </p>
              <p>
                <span className="font-semibold">State:</span> {address.state}
              </p>
              <p>
                <span className="font-semibold">PIN:</span> {address.pin}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleEdit(address._id)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
