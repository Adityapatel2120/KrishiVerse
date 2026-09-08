const express = require("express");

const router = express.Router();

const {
  getPredictions,
  createPrediction,
  deletePrediction,
  deleteAllPredictions,
} = require("../controllers/predictionController");

router.get(
  "/:userId",
  getPredictions
);

router.post(
  "/",
  createPrediction
);

router.delete(
  "/all/:userId",
  deleteAllPredictions
);

router.delete(
  "/:id",
  deletePrediction
);

module.exports = router;