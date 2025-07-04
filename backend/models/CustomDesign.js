const mongoose = require("mongoose");

const customDesignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    color: {
      type: String,
      required: true,
    },
    designs: {
      front: [
        {
          image: String,
          name: String,
          position: {
            x: Number,
            y: Number,
          },
          scale: Number,
          rotation: Number,
          opacity: Number,
          originalImageUrl: String,
          originalCloudinaryId: String,
        },
      ],
      back: [
        {
          image: String,
          name: String,
          position: {
            x: Number,
            y: Number,
          },
          scale: Number,
          rotation: Number,
          opacity: Number,
          originalImageUrl: String,
          originalCloudinaryId: String,
        },
      ],
      leftArm: [
        {
          image: String,
          name: String,
          position: {
            x: Number,
            y: Number,
          },
          scale: Number,
          rotation: Number,
          opacity: Number,
          originalImageUrl: String,
          originalCloudinaryId: String,
        },
      ],
      rightArm: [
        {
          image: String,
          name: String,
          position: {
            x: Number,
            y: Number,
          },
          scale: Number,
          rotation: Number,
          opacity: Number,
          originalImageUrl: String,
          originalCloudinaryId: String,
        },
      ],
    },
    frontImageUrl: {
      type: String,
      required: true,
    },
    frontCloudinaryId: {
      type: String,
      required: true,
    },
    backImageUrl: {
      type: String,
      required: true,
    },
    backCloudinaryId: {
      type: String,
      required: true,
    },
    rightArmImageUrl: {
      type: String,
      required: true,
    },
    rightArmCloudinaryId: {
      type: String,
      required: true,
    },
    leftArmImageUrl: {
      type: String,
      required: true,
    },
    leftArmCloudinaryId: {
      type: String,
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        "Approved",
        "Rejected",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    price: {
      type: Number,
      required: true,
      default: 2000,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", customDesignSchema);
