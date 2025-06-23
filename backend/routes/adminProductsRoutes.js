const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({ isTrending: false });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/admin/products/trending
// @desc Get all trending products
// @access Private/Admin
router.get("/trending", protect, admin, async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true });
    res.json(trendingProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
