const Revenue = require("../models/Revenue");

exports.getRevenues = async (req, res) => {
  const revenues = await Revenue.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(revenues);
};

exports.createRevenue = async (req, res) => {
  const revenue = await Revenue.create(req.body);
  res.status(201).json(revenue);
};

exports.updateRevenue = async (req, res) => {
  const revenue = await Revenue.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(revenue);
};

exports.deleteRevenue = async (req, res) => {
  await Revenue.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};