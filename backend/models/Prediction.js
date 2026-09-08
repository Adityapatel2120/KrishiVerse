const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    predictedClass: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    imageName: {
      type: String,
      default: "",
    },

    farmId: {
      type: String,
      default: "",
    },

    cropId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Prediction",
    predictionSchema
  );