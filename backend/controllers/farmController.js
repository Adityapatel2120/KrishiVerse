const Farm = require("../models/Farm");

exports.getFarms = async (req, res) => {
  const farms = await Farm.find({ userId: req.params.userId }).sort({ createdAt: 1 });
  res.json(farms);
};

exports.createFarm = async (req, res) => {
  const farm = await Farm.create(req.body);
  res.status(201).json(farm);
};

exports.updateFarm = async (req, res) => {
  const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(farm);
};

exports.deleteFarm = async (req, res) => {
  await Farm.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};