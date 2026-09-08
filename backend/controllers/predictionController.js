const Prediction = require("../models/Prediction");

exports.getPredictions = async (
  req,
  res
) => {
  try {
    const predictions =
      await Prediction.find({
        userId: req.params.userId,
      }).sort({
        createdAt: -1,
      });
    res.json(predictions);
  } catch (error) {
    console.error(
      "Get predictions error:",
      error
    );
    res.status(500).json({
      message:
        "Failed to fetch predictions",
      error: error.message,
    });
  }
};
exports.createPrediction = async (
  req,
  res
) => {
  try {
    console.log(
      "Prediction data received:",
      req.body
    );
    const {
      userId,
      predictedClass,
      confidence,
      imageName,
      farmId,
      cropId,
    } = req.body;
    if (!userId) {
      return res.status(400).json({
        message:
          "User ID is required",
      });
    }
    if (!predictedClass) {
      return res.status(400).json({
        message:
          "Predicted class is required",
      });
    }
    if (
      confidence === undefined ||
      confidence === null
    ) {
      return res.status(400).json({
        message:
          "Confidence is required",
      });
    }

    const prediction =
      await Prediction.create({
        userId,
        predictedClass,
        confidence: Number(
          confidence
        ),
        imageName: imageName || "",
        farmId: farmId || "",
        cropId: cropId || "",
      });
    res.status(201).json(
      prediction
    );
  } catch (error) {
    console.error(
      "Create prediction error:",
      error
    );
    res.status(500).json({
      message:
        "Failed to save prediction",
      error: error.message,
    });
  }
};

exports.deletePrediction = async (
  req,
  res
) => {
  try {
    await Prediction.findByIdAndDelete(
      req.params.id
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete prediction error:",
      error
    );
    res.status(500).json({
      message:
        "Failed to delete prediction",
      error: error.message,
    });
  }
};
exports.deleteAllPredictions =
  async (req, res) => {
    try {
      await Prediction.deleteMany({
        userId: req.params.userId,
      });

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "Delete all predictions error:",
        error
      );
      res.status(500).json({
        message:
          "Failed to delete predictions",
        error: error.message,
      });
    }
  };