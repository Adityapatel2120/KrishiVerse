const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  farmId: { type: String, required: true },
  sownDate: { type: String, required: true },
  areaInAcres: { type: Number, required: true },
  status: { type: String, default: "growing" },
}, { timestamps: true });

module.exports = mongoose.model("Crop", cropSchema);