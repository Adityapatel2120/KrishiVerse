const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  areaInAcres: { type: Number, required: true },
  soilType: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Farm", farmSchema);