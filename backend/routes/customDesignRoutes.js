const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const CustomDesign = require("../models/CustomDesign");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route POST /api/custom-designs
// @access Private
// @desc Save custom design
router.post(
  "/",
  protect,
  upload.fields([
    { name: "frontDesignImage", maxCount: 1 },
    { name: "backDesignImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        color,
        designs,
        shippingAddress,
        quantity = 1,
        price = 2000,
      } = req.body;

      const user = req.user._id;

      if (!req.files.frontDesignImage || !req.files.backDesignImage) {
        return res
          .status(400)
          .json({ message: "Both front and back images are required" });
      }

      // Calculate total price
      const totalPrice = price * quantity;

      // Upload front image to Cloudinary
      const frontResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "custom-designs" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.files.frontDesignImage[0].buffer);
      });

      // Upload back image to Cloudinary
      const backResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "custom-designs" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.files.backDesignImage[0].buffer);
      });

      // Create new custom design
      const customDesign = new CustomDesign({
        user,
        color,
        designs: JSON.parse(designs),
        frontImageUrl: frontResult.secure_url,
        frontCloudinaryId: frontResult.public_id,
        backImageUrl: backResult.secure_url,
        backCloudinaryId: backResult.public_id,
        shippingAddress: JSON.parse(shippingAddress),
        status: "Processing",
        price,
        quantity,
        totalPrice,
      });

      await customDesign.save();
      res.status(201).json(customDesign);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// ADMIN-ONLY ROUTES

// @route PUT /api/custom-designs/admin/:id/status
// @desc Update design status (admin only)
// @access Private/Admin
router.put("/admin/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "Approved",
        "Rejected",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const design = await CustomDesign.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/custom-designs/admin/all
// @desc Get all custom designs (admin only)
// @access Private/Admin
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const designs = await CustomDesign.find().populate("user", "name email");
    res.json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/custom-designs/admin/:id
// @desc Get any design details (admin only)
// @access Private/Admin
router.get("/admin/:id", protect, admin, async (req, res) => {
  try {
    const design = await CustomDesign.findById(req.params.id).populate("user", "name email");

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/custom-designs/admin/:id
// @desc Delete any design (admin only)
// @access Private/Admin
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const design = await CustomDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    await CustomDesign.findByIdAndDelete(req.params.id);
    await cloudinary.uploader.destroy(design.frontCloudinaryId);
    await cloudinary.uploader.destroy(design.backCloudinaryId);

    res.json({ message: "Design removed by admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//  USER-ONLY ROUTES

// @route GET /api/custom-designs/user
// @desc Get user's custom designs
// @access Private
router.get("/user", protect, async (req, res) => {
  try {
    const designs = await CustomDesign.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/custom-designs/user/:id
// @desc Get user's specific design
// @access Private
router.get("/user/:id", protect, async (req, res) => {
  try {
    const design = await CustomDesign.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/custom-designs/user/:id
// @desc Delete user's design
// @access Private
router.delete("/user/:id", protect, async (req, res) => {
  try {
    const design = await CustomDesign.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    await CustomDesign.findByIdAndDelete(req.params.id);
    await cloudinary.uploader.destroy(design.frontCloudinaryId);
    await cloudinary.uploader.destroy(design.backCloudinaryId);

    res.json({ message: "Your design has been removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
