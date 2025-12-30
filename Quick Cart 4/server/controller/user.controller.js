const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const { Genrateotp, sendmail } = require("../utils/sendmail");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const file = req.file;

  if (!username || !email || !password || !file) {
    return res.status(400).json({
      success: false,
      message: "All fields and image are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Genrateotp();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
    const imagepath = file.path;

    await sendmail(email, otp);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image: imagepath,
      otp,
      otpExpiration,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        userid: newUser._id,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(req.body);
  console.log(email);

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.otp || user.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (user.otpExpiration < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  user.isverified = true;
  user.otp = null;
  user.otpExpiration = null;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

const Resendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Genrateotp();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    await sendmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.log("Resend OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const Forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if(user.block){
      return res.status(404).json({
        success: false,
        message: "Your account is blocked by admin",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Genrateotp();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    user.isverified = false;
    await user.save();

    await sendmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.log("Resend OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const ResetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must be match",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = null;
    user.otpExpiration = null;
    user.isverified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (!user.isverified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account using OTP",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    if (user.block) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked by admin",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userid: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must match",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const BlockUser = async (req, res) => {
  try {
    const { userId, block } = req.body;

    if (!userId || block === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId and block status are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.block = block;
    await user.save();

    return res.status(200).json({
      success: true,
      message: block
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const Alluser = async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
};

const GoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // 🔐 dummy password (required by your schema)
      const hashedPassword = await bcrypt.hash(
        Math.random().toString(36),
        10
      );

      user = await User.create({
        username: name,
        email,
        password: hashedPassword,
        image: picture,
        isverified: true,
      });
    }

    if (user.block) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked by admin",
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        userid: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    console.log(err , '<<<<< Google Login Error');
    
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};


module.exports = {
  register,
  Loginuser,
  getMe,
  Alluser,
  verifyotp,
  Resendotp,
  Forgotpassword,
  ResetPassword,
  BlockUser,
  ChangePassword,
  GoogleLogin
};
