const express = require("express");
const router = express.Router();
const { getFarms, createFarm, updateFarm, deleteFarm } = require("../controllers/farmController");

router.get("/:userId", getFarms);
router.post("/", createFarm);
router.put("/:id", updateFarm);
router.delete("/:id", deleteFarm);

module.exports = router;