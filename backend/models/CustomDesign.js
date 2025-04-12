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
      type: Object,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", customDesignSchema);