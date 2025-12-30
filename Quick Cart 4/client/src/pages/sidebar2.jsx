import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar2 = ({ isOpen, toggleSidebar }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg font-medium cursor-pointer text-[18px]
     ${isActive ? "bg-[#fdeee6] text-[#172554]" : "text-[#172554] hover:bg-gray-100"}`;

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 pt-20 z-50
                    transform transition-transform duration-300
                    md:hidden
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col gap-1 px-2">
          <NavLink to="/admin/home" className={linkClass} onClick={toggleSidebar}>
            <img src="/add.svg" alt="Add" className="w-6 h-6" />
            <span>Add Product</span>
          </NavLink>
          <NavLink to="/admin/products" className={linkClass} onClick={toggleSidebar}>
            <img src="/product.svg" alt="Products" className="w-6 h-6" />
            <span>Product List</span>
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass} onClick={toggleSidebar}>
            <img src="/orders.svg" alt="Orders" className="w-6 h-6" />
            <span>Orders</span>
          </NavLink>
             <NavLink to="/admin/users" className={linkClass} onClick={toggleSidebar}>
            <img src="./account2.png" alt="Orders" className="w-6 h-6" />
            <span>Manage Users</span>
          </NavLink>
        </nav>
      </aside>

      <aside className="hidden md:block fixed top-[70px] left-0 h-screen w-64 bg-white border-r border-gray-200 pt-2">
        <nav className="flex flex-col gap-1 px-2">
          <NavLink to="/admin/home" className={linkClass}>
            <img src="/add.svg" alt="Add" className="w-6 h-6" />
            <span>Add Product</span>
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            <img src="/product.svg" alt="Products" className="w-6 h-6" />
            <span>Product List</span>
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <img src="/orders.svg" alt="Orders" className="w-6 h-6" />
            <span>Orders</span>
          </NavLink>
             <NavLink to="/admin/users" className={linkClass} onClick={toggleSidebar}>
            <img src="./account2.png" alt="Orders" className="w-6 h-6" />
            <span>Manage Users</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};
