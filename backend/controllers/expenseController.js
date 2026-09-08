const Expense = require("../models/Expense");

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId,
    }).sort({ createdAt: 1 });

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      message: "Failed to create expense",
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      message: "Failed to update expense",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
};