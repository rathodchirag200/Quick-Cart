import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../navbar";
import { Sidebar2 } from "../pages/sidebar2";

export const Adminlayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
      navigate("/admin/home");
    }
  }, [navigate]);

  return (
    <div className="flex">

      <Sidebar2 isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="pt-[70px] md:pl-[260px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
