import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Users = () => {
  const [users, setUsers] = useState([]);
const [isLoading, setisLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (userId, currentStatus) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/block",
        {
          userId,
          block: !currentStatus, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchUsers(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
        All Users
      </h2>

     
        <>
          <div className="hidden xl:block overflow-x-auto rounded-xl bg-white shadow-lg">
            <table className="min-w-full text-base md:text-lg text-gray-700">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Image</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Verified
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Block Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-20 h-20 overflow-hidden rounded-full border border-gray-300">
                        <img
                          src={user.image}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {user.username}
                    </td>

                    <td className="px-6 py-4 break-all text-gray-700">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          user.isverified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isverified ? "Verified" : "Not Verified"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleBlock(user._id, user.block)}
                        className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                          user.block
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {user.block ? "Unblock" : "Block"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden p-4 flex flex-col items-center"
              >
                <div className="w-32 h-32 overflow-hidden rounded-full border border-gray-300 mb-4">
                  <img
                    src={`http://localhost:3000/${user.image}`}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {user.username}
                </h3>

                <p className="text-gray-700 break-all text-center">
                  {user.email}
                </p>

                <span
                  className={`mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                    user.isverified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isverified ? "Verified" : "Not Verified"}
                </span>

                <button
                  onClick={() => handleBlock(user._id, user.block)}
                  className={`mt-3 px-4 py-2 rounded-full text-white text-sm font-semibold ${
                    user.block
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {user.block ? "Unblock" : "Block"}
                </button>

                <p className="text-gray-500 mt-2 text-sm">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
    </div>
  );
};
