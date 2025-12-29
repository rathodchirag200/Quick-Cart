const jwt = require("jsonwebtoken");
const User = require("../model/User");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    if (user.block) {
      return res
        .status(401)
        .json({ success: false, message: "User is blcoked by admin" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = auth;
