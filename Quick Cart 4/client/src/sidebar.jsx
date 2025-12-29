import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`
        fixed top-[70px] left-0 h-full bg-white shadow-lg z-40
        w-64 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 
      `}
    >
      <div className="flex flex-col gap-4 p-4">


        <NavLink
          to="/admin/home"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 px-4 py-2 bg-[#fdeee6] border-r-[5px] border-[#ea580c]"
              : "flex items-center gap-3 px-4 py-2"
          }
          onClick={toggleSidebar}
        >
          <img src="/add.svg" className="w-8 h-8" alt="Add" />
          <span className="text-[17px] font-semibold">Add Products</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 px-4 py-2 bg-[#fdeee6] border-r-[5px] border-[#ea580c]"
              : "flex items-center gap-3 px-4 py-2"
          }
          onClick={toggleSidebar}
        >
          <img src="/product.svg" className="w-8 h-8" alt="Products" />
          <span className="text-[17px] font-semibold">Products List</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 px-4 py-2 bg-[#fdeee6] border-r-[5px] border-[#ea580c]"
              : "flex items-center gap-3 px-4 py-2"
          }
          onClick={toggleSidebar}
        >
          <img src="/orders.svg" className="w-8 h-8" alt="Orders" />
          <span className="text-[17px] font-semibold">Orders</span>
        </NavLink>

      </div>
    </div>
  );
};
