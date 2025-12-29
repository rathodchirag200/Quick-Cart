import React from 'react';

export const Subscribe = () => {
  return (
    <div
    style={{paddingBottom: '120px'}} 
    className="flex flex-col gap-8 justify-center items-center w-full pb-[150px]  px-4 py-16 bg-white">

      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#374151] font-semibold">
          Subscribe now & get 20% off
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#a6aab2] font-medium max-w-xs sm:max-w-md md:max-w-xl mx-auto">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p>
      </div>

      <div className="flex w-full max-w-[600px] shadow-lg rounded-xl overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email id"
          className="w-[500px] max-w-full px-4 py-4 text-gray-700 text-sm sm:text-lg md:text-xl border border-[#dddee2] outline-none rounded-l-xl"
        />
        <button className="flex-1 bg-[#E65A0A] text-white px-3 py-4 text-sm sm:text-lg md:text-xl font-semibold hover:bg-orange-600 transition-all rounded-r-xl">
          Subscribe
        </button>
      </div>

    </div>
  );
};
