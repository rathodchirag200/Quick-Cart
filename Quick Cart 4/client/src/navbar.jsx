import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="fixed top-0 z-50 w-full h-[70px] flex items-center justify-between px-4 sm:px-8 border-b border-gray-300 bg-white">
      <div className="flex items-center">
        {/* Menu button only visible on mobile */}
        <button className="block md:hidden mr-3" onClick={toggleSidebar}>
          <img src="/menu.png" className="w-8 h-8" alt="menu" />
        </button>

        <NavLink to={"/"}>
          <img src="/logo.svg" className="w-[120px] hidden md:block" alt="Logo" />
        </NavLink>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gray-600 px-6 py-2 rounded-full text-white font-bold text-sm hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
};
