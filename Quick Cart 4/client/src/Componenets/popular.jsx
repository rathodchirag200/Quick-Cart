import React from "react";
import { NavLink } from "react-router-dom";

export const Popular = () => {
  return (
    <div className="max-w-[1550px] mx-auto px-6 md:px-10 lg:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        <div className="relative  overflow-hidden group">
          <img
            src={"./girl1.png"}
            className="w-full  object-cover group-hover:scale-105 duration-500"
            alt="girl1"
          />

          <div className="absolute bottom-10 left-10 text-white max-w-xs">
            <h2 className="text-3xl font-semibold leading-tight mb-3">
              Unparalleled Sound
            </h2>

            <p className="text-lg leading-snug mb-5">
              Experience crystal-clear audio with premium headphones.
            </p>
           
            <NavLink to={"/headphone"}>
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3  rounded-lg font-semibold text-white text-lg flex items-center gap-2">
              <span>Buy Now</span>
              <img src="./buy.svg" alt=""/>
            </button>
            </NavLink>
            
          </div>
        </div>


        <div className="relative  overflow-hidden group">
          <img
            src={"./girl2.png"} 
            className="w-full object-cover group-hover:scale-105 duration-500"
            alt="girl2"
          />

          <div className="absolute bottom-10 left-10 text-white max-w-xs">
            <h2 className="text-3xl font-semibold leading-tight mb-3">
              Stay Connected
            </h2>

            <p className="text-lg leading-snug mb-5">
              Compact and stylish earphones for every occasion.
            </p>

            <NavLink to={"/buds"}>
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3  rounded-lg font-semibold text-white text-lg flex items-center gap-2">
              <span>Buy Now</span>
              <img src="./buy.svg" alt=""/>
            </button>
            </NavLink>
          </div>
        </div>

        <div className="relative  overflow-hidden group">
          <img
            src={"./boys.png"} 
            className="w-full object-cover group-hover:scale-105 duration-500"
            alt="boy"
          />

          <div className="absolute bottom-10 left-10 text-white max-w-xs">
            <h2 className="text-3xl font-semibold leading-tight mb-3">
              Power in Every Pixel
            </h2>

            <p className="text-lg leading-snug mb-5">
              Shop the latest laptops for work, gaming, and more.
            </p>

             <NavLink to={"/laptop"}>
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3  rounded-lg font-semibold text-white text-lg flex items-center gap-2">
              <span>Buy Now</span>
              <img src="./buy.svg" alt=""/>
            </button>
            </NavLink>
          </div>
        </div>

      </div>
    </div>
  );
};
