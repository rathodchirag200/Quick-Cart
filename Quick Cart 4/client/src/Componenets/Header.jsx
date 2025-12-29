import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>

      <div className="max-w-full flex justify-between items-center h-[70px] border-b border-[#d1d5db] px-4">
        <NavLink to="/">
          <img className="w-30 h-30" src="/logo.svg" alt="Logo" />
        </NavLink>

        <ul className="hidden md:flex gap-8 items-center text-[#374151] text-[17px] font-semibold">
          <NavLink to="/"><li>Home</li></NavLink>
          <NavLink to="/shop"><li>Shop</li></NavLink>
          <li>About us</li>
          <li>Contact us</li>
        </ul>

        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative" ref={dropdownRef}>

              <img
                src={user.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />


              <div
                className={`absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-2xl overflow-hidden border transition-all duration-300 origin-top-right z-50
                ${dropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
              >
                <ul className="flex flex-col py-2">
                  <NavLink
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <img src="/account2.png" className="w-5 h-5" />
                    <span>Profile</span>
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <img src="/cart.png" className="w-5 h-5" />
                    <span>Cart</span>
                  </NavLink>

                  <NavLink
                    to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <img src="/orders4.png" className="w-5 h-5" />
                    <span>My Orders</span>
                  </NavLink>

                  <NavLink
                    to="/wishlist"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <img src="/wishlist.png" className="w-5 h-5" />
                    <span>Wishlist</span>
                  </NavLink>

                  <NavLink
                    to="/alladdress"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <img src="../../public/address.png" className="w-5 h-5" />
                    <span>Address</span>
                  </NavLink>

                  <li
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <img src="/signout.png" className="w-7 h-7" />
                    <span>Sign Out</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <NavLink to="/login">
                <img src="/account2.png" className="w-6 h-6 cursor-pointer" />
              </NavLink>
              <NavLink to="/cart">
                <img src="/cart.png" className="w-6 h-6" />
              </NavLink>
            </div>
          )}


          <img
            src="/menu.png"
            className="lg:hidden md:hidden w-5 h-6 cursor-pointer"
            onClick={() => setMobileMenu(true)}
          />
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transition-transform duration-300
        ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <img
            src="/close.png"
            className="w-8 h-8 cursor-pointer"
            onClick={() => setMobileMenu(false)}
          />
        </div>

        <ul className="flex flex-col gap-6 p-6 text-[18px] font-medium">
          <NavLink to="/" onClick={() => setMobileMenu(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMobileMenu(false)}>Shop</NavLink>
          <li>About us</li>
          <li>Contact us</li>
        </ul>
      </div>


      {mobileMenu && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
    </>
  );
};
