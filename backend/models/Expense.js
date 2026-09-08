const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  note: { type: String, default: "" },
  farmId: { type: String, default: null },
  cropId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);