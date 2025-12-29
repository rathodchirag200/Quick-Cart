const mongoose = require("mongoose");
const { schema } = require("./Product");

const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    otp: {
      type: String,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    otpExpiration: {
      type: Date,
    },
     block:{
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", 
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", Userschema);

module.exports = User;
