import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  Leaf,
  Clock,
  XCircle,
} from "lucide-react";

import { usePrediction } from "../../hooks/usePrediction";
import { useFarm } from "../../hooks/useFarm";
import { useCrop } from "../../hooks/useCrop";

import ConfirmDialog from "../common/ConfirmDialog";

const formatClassName = (className) => {
  if (!className) return "";

  return className
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const PredictionHistory = () => {
  const { t } = useTranslation();

  const {
    predictions,
    loading,
    deletePrediction,
    deleteAllPredictions,
  } = usePrediction();

  const { farms } = useFarm();
  const { crops } = useCrop();

  const [confirmTarget, setConfirmTarget] =
    useState(null);

  const handleConfirm = async () => {
    try {
      if (confirmTarget === "all") {
        await deleteAllPredictions();
      } else if (confirmTarget) {
        await deletePrediction(
          confirmTarget
        );
      }
    } catch (error) {
      console.error(
        "Error deleting prediction:",
        error
      );
    } finally {
      setConfirmTarget(null);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-400">
        {t(
          "common.loading",
          "Loading..."
        )}
      </p>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-300">
        <Leaf
          size={32}
          className="mx-auto"
        />

        <p className="text-sm text-gray-400 mt-2">
          No predictions yet
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Delete All */}
      <button
        type="button"
        onClick={() =>
          setConfirmTarget("all")
        }
        className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 border border-red-100 rounded-xl py-2 mb-3 transition-colors"
      >
        <XCircle size={14} />

        {t(
          "prediction.deleteAll",
          "Delete All"
        )}
      </button>

      {/* History List */}
      <div className="space-y-3">
        {predictions.map((prediction) => {
          const farm = farms.find(
            (f) =>
              f._id === prediction.farmId
          );

          const crop = crops.find(
            (c) =>
              c._id === prediction.cropId
          );

          return (
            <div
              key={prediction._id}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3"
            >
              <div className="min-w-0">
                {/* Disease */}
                <p className="text-sm font-medium text-gray-800">
                  {formatClassName(
                    prediction.predictedClass
                  )}
                </p>

                {/* Farm + Crop */}
                {(farm || crop) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {farm?.name ||
                      "Unknown farm"}

                    {crop
                      ? ` · ${formatClassName(
                          crop.type
                        )}`
                      : ""}
                  </p>
                )}

                {/* Date + Confidence */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <Clock size={12} />

                  {new Date(
                    prediction.createdAt
                  ).toLocaleString()}

                  <span>
                    ·{" "}
                    {prediction.confidence}%
                    confidence
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() =>
                  setConfirmTarget(
                    prediction._id
                  )
                }
                className="ml-3 flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={
          confirmTarget !== null
        }
        onClose={() =>
          setConfirmTarget(null)
        }
        onConfirm={handleConfirm}
        title={
          confirmTarget === "all"
            ? t(
                "prediction.deleteAll",
                "Delete All"
              )
            : t(
                "common.delete",
                "Delete"
              )
        }
        message={
          confirmTarget === "all"
            ? t(
                "prediction.deleteAllConfirm",
                "Delete all prediction history? This cannot be undone."
              )
            : t(
                "prediction.deleteConfirm",
                "Delete this prediction record?"
              )
        }
      />
    </div>
  );
};

export default PredictionHistory;