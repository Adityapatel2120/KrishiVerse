const express = require("express");
const router = express.Router();
const { getCrops, createCrop, updateCrop, deleteCrop } = require("../controllers/cropController");

router.get("/:userId", getCrops);
router.post("/", createCrop);
router.put("/:id", updateCrop);
router.delete("/:id", deleteCrop);

module.exports = router;