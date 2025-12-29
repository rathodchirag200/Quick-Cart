import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

export const Profile = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { logout} = useContext(AuthContext);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:3000/api/currentuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/login");
    }
  };


 const Gotochange = () =>{
  navigate("/change-pasword");
 }

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };



  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No user data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-[700px] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        {user.image && (
          <img
            src={user.image}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
          />
        )}

        <div className="flex flex-col gap-3 justify-center items-center">
          <p>
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <button 
          onClick={Gotochange}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <span className="font-semibold">Change Password</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
