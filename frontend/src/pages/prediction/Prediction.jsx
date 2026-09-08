import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  UploadCloud,
  ScanSearch,
  Stethoscope,
  History,
  Camera,
  X,
  RotateCcw,
} from "lucide-react";

import { usePrediction } from "../../hooks/usePrediction";
import { useFarm } from "../../hooks/useFarm";
import { useCrop } from "../../hooks/useCrop";
import { getDiseaseInfo } from "../../constants/diseaseInfo";
import PredictionHistory from "../../components/prediction/PredictionHistory";

const cropOptions = [
  "wheat",
  "rice",
  "maize",
  "sugarcane",
  "cotton",
  "groundnut",
];

const Prediction = () => {
  const { t } = useTranslation();
  const { addPrediction } = usePrediction();
  const { farms } = useFarm();
  const { crops } = useCrop();

  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile?.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError("");
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      setError(
        t(
          "prediction.cameraError",
          "Could not access camera. Please check permissions."
        )
      );
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const capturedFile = new File(
        [blob],
        "camera-capture.jpg",
        { type: "image/jpeg" }
      );

      handleFile(capturedFile);
      closeCamera();
    }, "image/jpeg");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    if (selectedCrop) {
      formData.append("crop", selectedCrop);
    }

    try {
      const response = await fetch(
        "http://localhost:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setResult(data);

      await addPrediction({
        predictedClass: data.predicted_class,
        confidence: Number(data.confidence),
        imageName: file.name,

        // Save which farm/crop this prediction belongs to
        farmId: selectedFarm || null,
        cropId: selectedCropRecord?._id || null,
      });
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        t(
          "prediction.analyzeError",
          "Could not analyze image. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatClassName = (className = "") =>
    className
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  const selectedCropRecord = crops?.find(
    (crop) =>
      crop._id === selectedCrop ||
      crop.type === selectedCrop
  );

  const isHealthy =
    result?.predicted_class?.includes("healthy");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t(
            "prediction.title",
            "Crop Disease Prediction"
          )}
        </h1>

        <p className="text-gray-500 text-sm">
          {t(
            "prediction.subtitle",
            "Upload a leaf image to detect possible disease"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          {/* Farm & Crop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Farm
              </label>

              <select
                value={selectedFarm}
                onChange={(e) =>
                  setSelectedFarm(e.target.value)
                }
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
              >
                <option value="">Select Farm</option>

                {farms?.map((farm) => (
                  <option
                    key={farm._id}
                    value={farm._id}
                  >
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Crop
              </label>

              <select
                value={selectedCrop}
                onChange={(e) =>
                  setSelectedCrop(e.target.value)
                }
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
              >
                <option value="">Select Crop</option>

                {crops?.length > 0
                  ? crops.map((crop) => (
                      <option
                        key={crop._id}
                        value={crop._id}
                      >
                        {t(
                          `crops.${crop.type}`,
                          crop.type
                        )}
                      </option>
                    ))
                  : cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {t(`crops.${crop}`, crop)}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-56 transition-colors overflow-hidden ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />

                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 p-1.5 rounded-full shadow transition-colors"
                  title={t(
                    "prediction.changeImage",
                    "Change Image"
                  )}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center text-gray-400 cursor-pointer w-full h-full justify-center">
                <UploadCloud size={36} />

                <p className="text-sm mt-2">
                  {t(
                    "prediction.uploadPrompt",
                    "Click or drag an image here to upload"
                  )}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            {preview && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-colors"
              >
                <RotateCcw size={18} />
                {t(
                  "prediction.changeImage",
                  "Change Image"
                )}
              </button>
            )}

            <button
              onClick={openCamera}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors"
            >
              <Camera size={18} />

              {t(
                "prediction.useCamera",
                "Camera"
              )}
            </button>

            <button
              onClick={handleAnalyze}
              disabled={!preview || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              <ScanSearch size={18} />

              {loading
                ? t("common.loading", "Loading...")
                : t(
                    "prediction.analyze",
                    "Analyze Image"
                  )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2 mt-4">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-4 space-y-3">
              <div
                className={`rounded-xl p-4 border ${
                  isHealthy
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isHealthy
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {t(
                    "prediction.resultLabel",
                    "Prediction Result"
                  )}
                </p>

                <p className="text-lg font-bold text-gray-800 mt-1">
                  {formatClassName(
                    result.predicted_class
                  )}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {t(
                    "prediction.confidence",
                    "Confidence"
                  )}
                  : {result.confidence}%
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope
                    size={16}
                    className="text-blue-600"
                  />

                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {t(
                      "prediction.recommendedAction",
                      "Recommended Action"
                    )}
                  </p>
                </div>

                <p className="text-sm text-gray-700">
                  {
                    getDiseaseInfo(
                      result.predicted_class
                    ).advice
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <History
              size={18}
              className="text-gray-600"
            />

            <h3 className="font-semibold text-gray-800">
              {t(
                "prediction.historyTitle",
                "Prediction History"
              )}
            </h3>
          </div>

          <PredictionHistory />
        </div>
      </div>

      {/* Camera */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                {t(
                  "prediction.useCamera",
                  "Camera"
                )}
              </h3>

              <button
                onClick={closeCamera}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-xl bg-black"
            />

            <button
              onClick={capturePhoto}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              {t(
                "prediction.capturePhoto",
                "Capture Photo"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;