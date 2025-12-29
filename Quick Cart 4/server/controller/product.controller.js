const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");

const Addproduct = async (req, res) => {
  const {
    name,
    category,
    description,
    compny_name,
    offer_prise,
    prise,
    ratings,
    bestseller,
  } = req.body;
  const files = req.files;

  if (
    !name ||
    !category ||
    !description ||
    !compny_name ||
    !offer_prise ||
    !prise ||
    !files ||
    files.length === 0 ||
    !ratings
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const images = req.files.map((file) => file.path);

    const newProduct = new Product({
      name,
      category,
      description,
      compny_name,
      offer_prise,
      prise,
      images,
      ratings,
      bestseller,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const displayproduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    let sort = req.query.sort;
    let categories = req.query.category;

    const categoriesOption = [
      "Earphone",
      "Headphone",
      "SmartWatch",
      "Laptop",
      "Camera",
      "Speaker",
      "Smartphone"
    ];

    if (!categories) {
      categories = categoriesOption;
    } else {
      categories = categories.split(",");
    }

    let sortBy = {};

    if (sort) {
      const sortArr = sort.split(",");
      sortBy[sortArr[0]] = sortArr[1] === "asc" ? 1 : -1;
    } else {
      sortBy = { createdAt: -1 };
    }

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
      category: { $in: categories },
    })
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments({
      category: { $in: categories },
      name: { $regex: search, $options: "i" },
    });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      products,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteproduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Images user wants to keep
    let oldImages = [];
    if (req.body.oldImages) {
      oldImages = Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages];
    }

    // Newly uploaded Cloudinary images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: [...oldImages, ...newImages],
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  Addproduct,
  displayproduct,
  getProductById,
  deleteproduct,
  updateproduct,
};
