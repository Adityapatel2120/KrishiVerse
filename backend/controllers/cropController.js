const Crop = require("../models/Crop");

exports.getCrops = async (req, res) => {
  const crops = await Crop.find({ userId: req.params.userId }).sort({ createdAt: 1 });
  res.json(crops);
};

exports.createCrop = async (req, res) => {
  const crop = await Crop.create(req.body);
  res.status(201).json(crop);
};

exports.updateCrop = async (req, res) => {
  const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(crop);
};

exports.deleteCrop = async (req, res) => {
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};