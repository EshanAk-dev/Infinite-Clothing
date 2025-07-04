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
  upload.any(), // Change to upload.any() to handle dynamic fields
  async (req, res) => {
    try {
      const {
        color,
        designs,
        originalDesignFiles,
        shippingAddress,
        quantity = 1,
        price = 2000,
      } = req.body;

      const user = req.user._id;

      // Find the main design images
      const frontDesignImage = req.files.find(
        (f) => f.fieldname === "frontDesignImage"
      );
      const backDesignImage = req.files.find(
        (f) => f.fieldname === "backDesignImage"
      );
      const leftArmDesignImage = req.files.find(
        (f) => f.fieldname === "leftArmDesignImage"
      );
      const rightArmDesignImage = req.files.find(
        (f) => f.fieldname === "rightArmDesignImage"
      );

      if (
        !frontDesignImage ||
        !backDesignImage ||
        !leftArmDesignImage ||
        !rightArmDesignImage
      ) {
        return res.status(400).json({
          message: "Front, back, left arm, and right arm images are required",
        });
      }

      // Calculate total price
      const totalPrice = price * quantity;

      // Upload main design images (existing code)
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
        stream.end(frontDesignImage.buffer);
      });

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
        stream.end(backDesignImage.buffer);
      });

      const leftArmResult = await new Promise((resolve, reject) => {
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
        stream.end(leftArmDesignImage.buffer);
      });

      const rightArmResult = await new Promise((resolve, reject) => {
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
        stream.end(rightArmDesignImage.buffer);
      });

      // Upload original design files
      const parsedDesigns = JSON.parse(designs);
      const parsedOriginalFiles = JSON.parse(originalDesignFiles);

      for (const viewType of ["front", "back", "rightArm", "leftArm"]) {
        if (parsedOriginalFiles[viewType]) {
          for (let i = 0; i < parsedOriginalFiles[viewType].length; i++) {
            const originalFile = req.files.find(
              (f) => f.fieldname === `originalDesign_${viewType}_${i}`
            );

            if (originalFile) {
              const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "original-designs" },
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
                stream.end(originalFile.buffer);
              });

              // Find the corresponding design and add URLs
              const designIndex = parsedDesigns[viewType].findIndex(
                (d) => d.id === parsedOriginalFiles[viewType][i].id
              );

              if (designIndex !== -1) {
                parsedDesigns[viewType][designIndex].originalImageUrl =
                  uploadResult.secure_url;
                parsedDesigns[viewType][designIndex].originalCloudinaryId =
                  uploadResult.public_id;
              }
            }
          }
        }
      }

      // Create new custom design
      const customDesign = new CustomDesign({
        user,
        color,
        designs: parsedDesigns,
        frontImageUrl: frontResult.secure_url,
        frontCloudinaryId: frontResult.public_id,
        backImageUrl: backResult.secure_url,
        backCloudinaryId: backResult.public_id,
        leftArmImageUrl: leftArmResult.secure_url,
        leftArmCloudinaryId: leftArmResult.public_id,
        rightArmImageUrl: rightArmResult.secure_url,
        rightArmCloudinaryId: rightArmResult.public_id,
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
    const design = await CustomDesign.findById(req.params.id).populate(
      "user",
      "name email"
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
    await cloudinary.uploader.destroy(design.rightArmCloudinaryId);
    await cloudinary.uploader.destroy(design.leftArmCloudinaryId);

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
    await cloudinary.uploader.destroy(design.rightArmCloudinaryId);
    await cloudinary.uploader.destroy(design.leftArmCloudinaryId);

    res.json({ message: "Your design has been removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
