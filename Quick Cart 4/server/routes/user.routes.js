const express = require("express");
const router = express.Router();
const upload = require("../middlewear/upload");
const auth = require("../middlewear/auth");
const adminauth = require("../middlewear/adminauth");

const { register, Loginuser, getMe, Alluser , verifyotp , GoogleLogin, Resendotp , Forgotpassword , ResetPassword , BlockUser , ChangePassword } = require("../controller/user.controller");

router.post("/register", upload.single("image"), register);
router.post("/login", Loginuser);
router.get("/currentuser", auth, getMe);
router.get("/users", Alluser);
router.post("/verifyotp" , verifyotp);
router.post("/resend-otp" , Resendotp);
router.post("/reset-password" , ResetPassword);
router.post("/forggot-password" , Forgotpassword);
router.post("/change-password" , auth , ChangePassword);
router.post("/block" , adminauth , BlockUser);

router.post("/google-login", GoogleLogin);

module.exports = router;
