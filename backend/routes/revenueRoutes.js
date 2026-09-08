const express = require("express");
const router = express.Router();
const { getRevenues, createRevenue, updateRevenue, deleteRevenue } = require("../controllers/revenueController");

router.get("/:userId", getRevenues);
router.post("/", createRevenue);
router.put("/:id", updateRevenue);
router.delete("/:id", deleteRevenue);

module.exports = router;