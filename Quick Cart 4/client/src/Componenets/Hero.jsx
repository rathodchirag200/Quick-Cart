import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { NavLink } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-[50px] mt-10 mb-10">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={40}
        slidesPerView={1}
        className="w-full max-w-[1700px]"
      >
        {/* SLIDE 1 */}
        <SwiperSlide>
          <div
            className="
            hero w-full flex gap-10 px-5 py-10 rounded-2xl h-auto lg:h-[400px] bg-[#e6e9f2]
            flex-col lg:flex-row
            "
          >

            <div
              className="
              hero2 flex flex-col justify-center gap-4 
              w-full lg:w-1/2
              order-2 lg:order-1
              text-center lg:text-left
              "
            >
              <div className="text-[#ea580c] font-bold text-[16px] sm:text-[17px]">
                Limited Time Offer 30% Off
              </div>

              <div className="text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#374151] font-semibold">
                Experience Pure Sound - Your Perfect Headphones Awaits!
              </div>

              <div className="flex justify-center lg:justify-start gap-6 pt-3">
                <NavLink to={"/shop"}>
                   <button className="bg-[#ea580c] cursor-pointer text-white font-bold px-8 sm:px-10 py-2 sm:py-3 rounded-full">
                  Buy Now
                </button>
                </NavLink>
               

                <button className="flex gap-2 items-center font-bold">
                  Learn More
                  <img src="/right.png" className="w-5 h-5" alt="" />
                </button>
              </div>
            </div>

            <div
              className="
              hero3 w-full lg:w-1/2 flex justify-center items-center 
              order-1 lg:order-2
              "
            >
              <img
                src="/headphone.webp"
                className="
                w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]
                h-auto object-contain
                "
                alt=""
              />
            </div>
          </div>
        </SwiperSlide>


        <SwiperSlide>
          <div
            className="
            w-full flex gap-10 px-5 py-10 rounded-2xl h-auto lg:h-[400px] bg-[#e6e9f2]
            flex-col lg:flex-row
            "
          >
            <div
              className="
              flex flex-col justify-center gap-4 
              w-full lg:w-1/2
              order-2 lg:order-1
              text-center lg:text-left
              "
            >
              <div className="text-[#ea580c] font-bold text-[16px] sm:text-[17px]">
                Exclusive Deal 40% Off
              </div>

              <div className="text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#374151] font-semibold">
                Next-Level Gaming Starts Here - Discover PlayStation 5 Today!
              </div>

              <div className="flex justify-center lg:justify-start gap-6 pt-3">
                 <NavLink to={"/shop"}>
                   <button className="bg-[#ea580c] cursor-pointer text-white font-bold px-8 sm:px-10 py-2 sm:py-3 rounded-full">
                  Buy Now
                </button>
                </NavLink>

                <button className="flex gap-2 items-center font-bold">
                  Learn More
                  <img src="/right.png" className="w-5 h-5" alt="" />
                </button>
              </div>
            </div>

            <div
              className="
              w-full lg:w-1/2 flex justify-center items-center 
              order-1 lg:order-2
              "
            >
              <img
                src="/playstation.webp"
                className="
                w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]
                h-auto object-contain
                "
                alt=""
              />
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="
            w-full flex gap-10 px-5 py-10 rounded-2xl h-auto lg:h-[400px] bg-[#e6e9f2]
            flex-col lg:flex-row
            "
          >
            <div
              className="
              flex flex-col justify-center gap-4 
              w-full lg:w-1/2
              order-2 lg:order-1
              text-center lg:text-left
              "
            >
              <div className="text-[#ea580c] font-bold text-[16px] sm:text-[17px]">
                Hurry up only few left!
              </div>

              <div className="text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#374151] font-semibold">
                Power Meets Elegance - Apple MacBook Pro is Here for you!
              </div>

              <div className="flex justify-center lg:justify-start gap-6 pt-3">
                 <NavLink to={"/shop"}>
                   <button className="bg-[#ea580c] cursor-pointer text-white font-bold px-8 sm:px-10 py-2 sm:py-3 rounded-full">
                  Buy Now
                </button>
                </NavLink>

                <button className="flex gap-2 items-center font-bold">
                  Learn More
                  <img src="/right.png" className="w-5 h-5" alt="" />
                </button>
              </div>
            </div>

            <div
              className="
              w-full lg:w-1/2 flex justify-center items-center 
              order-1 lg:order-2
              "
            >
              <img
                src="/macbook.webp"
                className="
                w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]
                h-auto object-contain
                "
                alt=""
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
