const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cropId: { type: String, required: true },
  farmId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  buyerName: { type: String, default: "" },
  note: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Revenue", revenueSchema);