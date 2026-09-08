const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require("../controllers/expenseController");

router.get("/:userId", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;