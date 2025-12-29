import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Otpmodal = ({ email }) => {
  const [otp, setotp] = useState({
    Digit1: "",
    Digit2: "",
    Digit3: "",
    Digit4: "",
  });

  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;

    if (value.length > 1) return;

    setotp({
      ...otp,
      [name]: value,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.Digit1 + otp.Digit2 + otp.Digit3 + otp.Digit4;

    if (finalOtp.length !== 4) {
      toast.error("Please enter complete 4-digit OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/verifyotp", {
        email,
        otp: finalOtp,
      });


      if (res.data.success) {
        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.log("OTP verification error", err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleresend = async() =>{
    try{
      const res = await axios.post("http://localhost:3000/api/resend-otp",{
       email
      });
      
      if(res.data.success){
        toast.success(res.data.message);
      }
      else{
        toast.error("not resend otp");
      }

    }
    catch{
       toast.error("resend otp is not successfully");
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000000a8] bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-full  fixed bg-gray mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your email.
          </p>
        </header>

        <form className="" id="otp-form" onSubmit={handlesubmit}>
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              name="Digit1"
              value={otp.Digit1}
              onChange={handlechange}
              maxLength="1"
              className="w-14 h-14 text-center text-2xl font-extrabold bg-slate-100 rounded"
            />

            <input
              type="text"
              name="Digit2"
              value={otp.Digit2}
              onChange={handlechange}
              maxLength="1"
              className="w-14 h-14 text-center text-2xl font-extrabold bg-slate-100 rounded"
            />

            <input
              type="text"
              name="Digit3"
              value={otp.Digit3}
              onChange={handlechange}
              maxLength="1"
              className="w-14 h-14 text-center text-2xl font-extrabold bg-slate-100 rounded"
            />

            <input
              type="text"
              name="Digit4"
              value={otp.Digit4}
              onChange={handlechange}
              maxLength="1"
              className="w-14 h-14 text-center text-2xl font-extrabold bg-slate-100 rounded"
            />
          </div>

          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Verify Account
            </button>
          </div>
        </form>

        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{" "}
          <span
          onClick={handleresend} 
          className="font-medium text-indigo-500 cursor-pointer">
            Resend
          </span>
        </div>
      </div>
    </div>
  );
};
