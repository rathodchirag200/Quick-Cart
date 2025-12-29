const express = require('express');
const router = express.Router();
const {createOrder , getAllOrders , orderbyid , Orderstatus , Cancelorder} = require("../controller/order.controller");
const auth = require("../middlewear/auth");
const adminauth = require("../middlewear/adminauth");

router.post("/orders/create" , auth , createOrder);
router.get("/orders/allorders"  , getAllOrders);
router.get("/orders" , auth , orderbyid);
router.put("/orders/:orderid" , adminauth , Orderstatus);
router.put("/cancelorder/:orderid" , auth , Cancelorder);

module.exports = router;