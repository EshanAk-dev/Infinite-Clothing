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
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomDesign", customDesignSchema);