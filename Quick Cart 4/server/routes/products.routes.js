const express = require("express");
const router = express.Router();
const {
  Addproduct,
  displayproduct,
  getProductById,
  deleteproduct,
  updateproduct,
} = require("../controller/product.controller");

const upload = require("../middlewear/upload");
const adminauth = require("../middlewear/adminauth");


router.post("/addproducts", adminauth, upload.array("images", 10), Addproduct);

router.put(
  "/products/:id",
  adminauth,
  upload.array("images", 10),
  updateproduct
);

router.delete("/products/:id", adminauth, deleteproduct);

router.get("/products", displayproduct);
router.get("/products/:id", getProductById);

module.exports = router;
