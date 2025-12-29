const express = require('express');
const router = express.Router();
const {createpayment , verifyPayment , refundpayment} = require("../controller/payment.controller");
const auth = require("../middlewear/auth");
const adminauth = require("../middlewear/adminauth");

router.post("/payment/create" , auth , createpayment);
router.post("/payment/verify" , auth , verifyPayment);
router.post("/payment/refund/:orderid", adminauth , refundpayment);

module.exports = router;