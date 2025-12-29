const jwt = require("jsonwebtoken");
require("dotenv").config();

const Adminlogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secretKey = process.env.JWT_SECRET_KEY;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  const token = jwt.sign({ email, role: "admin" }, secretKey, {
    expiresIn: "5h",
  });

  res.json({ success: true, token });
};

module.exports = Adminlogin;
