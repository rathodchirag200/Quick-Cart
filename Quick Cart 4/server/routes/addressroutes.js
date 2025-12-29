const express = require('express');
const router = express.Router();
const {createAddress , addressbyid , editAddress , singleaddress} = require("../controller/addresscontroller");
const auth = require("../middlewear/auth")

router.post("/address" , auth , createAddress);
router.get("/getaddress" , auth , addressbyid);
router.put("/address/:id" , editAddress);
router.get("/address/:id", singleaddress);

module.exports = router;