import React from "react";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  const links = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: "Profile", url: "/profile" },
    { name: "Orders", url: "/my-orders" },
    { name: "Wishlist", url: "/wishlist" },
  ];

  return (
    <footer className="w-full bg-[#f8f9fc] text-[#808692] py-10 px-6 sm:px-10 md:px-20">
      <div className="max-w-full footer mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">

        <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
          <img src="/logo.svg" className="w-28" alt="logo" />
          <p className="text-sm leading-6 max-w-md">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
        </div>

        {["Company", "Support", "Explore", "Link"].map((title, index) => (
          <div key={index} className="flex flex-col gap-3">
            <h3 className="text-[#191d27] font-semibold mb-1">{title}</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {links.map((link, idx) => (
                <li key={idx} className="hover:text-black cursor-pointer transition">
                  <NavLink to={link.url}>{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-5 text-center text-sm text-[#808692]">
        © {new Date().getFullYear()} YourBrand — All Rights Reserved
      </div>
    </footer>
  );
};
