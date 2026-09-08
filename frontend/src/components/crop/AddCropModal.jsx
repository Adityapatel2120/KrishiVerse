import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X, AlertCircle, Lock } from "lucide-react";
import { useCrop } from "../../hooks/useCrop";
import { useFarm } from "../../hooks/useFarm";

const cropTypes = [
  "wheat",
  "rice",
  "cotton",
  "sugarcane",
  "maize",
  "groundnut",
];

const editableStatuses = [
  "growing",
  "harvested",
  "diseased",
];

const emptyForm = (farms) => ({
  type: cropTypes[0],
  farmId: farms[0]?._id || "",
  sownDate: "",
  areaInAcres: "",
  status: "growing",
});

const AddCropModal = ({
  isOpen,
  onClose,
  cropToEdit = null,
}) => {
  const { t } = useTranslation();
  const {
    addCrop,
    updateCrop,
    crops,
  } = useCrop();

  const { farms } = useFarm();

  const [form, setForm] = useState(emptyForm(farms));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(cropToEdit);
  const wasAlreadyHarvested = cropToEdit?.status === "harvested";

  useEffect(() => {
    if (!isOpen) return;

    if (cropToEdit) {
      setForm({
        type: cropToEdit.type || cropTypes[0],
        farmId: cropToEdit.farmId || "",
        sownDate: cropToEdit.sownDate || "",
        areaInAcres: cropToEdit.areaInAcres ?? "",
        status: cropToEdit.status || "growing",
      });
    } else {
      setForm(emptyForm(farms));
    }

    setError("");
    setSaving(false);
  }, [cropToEdit, isOpen, farms]);

  // Calculate available farm area while excluding the crop being edited
  const farmCapacity = useMemo(() => {
    const selectedFarm = farms.find(
      (farm) => farm._id === form.farmId
    );

    if (!selectedFarm) {
      return null;
    }

    const usedByOtherCrops = crops
      .filter(
        (crop) =>
          crop.farmId === form.farmId &&
          crop._id !== cropToEdit?._id
      )
      .reduce(
        (sum, crop) => sum + Number(crop.areaInAcres || 0),
        0
      );

    const remaining =
      Number(selectedFarm.areaInAcres) - usedByOtherCrops;

    return {
      totalArea: Number(selectedFarm.areaInAcres),
      usedArea: usedByOtherCrops,
      remainingArea: Math.max(remaining, 0),
    };
  }, [
    form.farmId,
    farms,
    crops,
    cropToEdit,
  ]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.farmId) {
      setError(t("crop.noFarmsWarning"));
      return;
    }

    if (!form.sownDate || !form.areaInAcres) {
      setError(t("farm.fillAllFields"));
      return;
    }

    if (Number(form.areaInAcres) <= 0) {
      setError(t("farm.areaInvalid"));
      return;
    }

    if (
      farmCapacity &&
      Number(form.areaInAcres) > farmCapacity.remainingArea
    ) {
      setError(
        t("crop.areaExceedsCapacity", {
          remaining: farmCapacity.remainingArea.toFixed(1),
          defaultValue: `Only ${farmCapacity.remainingArea.toFixed(
            1
          )} acres available on this farm`,
        })
      );
      return;
    }

    // Once a crop has been marked harvested, status can never revert
    const finalStatus = wasAlreadyHarvested ? "harvested" : form.status;

    try {
      setSaving(true);

      if (isEditMode) {
        // Update the crop using its MongoDB _id
        await updateCrop(cropToEdit._id, {
          type: form.type,
          farmId: form.farmId,
          sownDate: form.sownDate,
          areaInAcres: Number(form.areaInAcres),
          status: finalStatus,
        });
      } else {
        // Create the crop in MongoDB
        await addCrop({
          type: form.type,
          farmId: form.farmId,
          sownDate: form.sownDate,
          areaInAcres: Number(form.areaInAcres),
          status: finalStatus,
        });
      }

      setForm(emptyForm(farms));
      setError("");
      onClose();
    } catch (err) {
      console.error("Error saving crop:", err);

      setError(
        err.message ||
          "Failed to save crop. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode
              ? t("crop.editCrop")
              : t("crop.addCrop")}
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2 mb-4 flex items-start gap-2">
            <AlertCircle
              size={16}
              className="mt-0.5 flex-shrink-0"
            />
            {error}
          </div>
        )}

        {farms.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("crop.noFarmsWarning")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("crop.cropType")}
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
              >
                {cropTypes.map((crop) => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {t(`crops.${crop}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("crop.selectFarm")}
              </label>

              <select
                name="farmId"
                value={form.farmId}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
              >
                {farms.map((farm) => (
                  <option
                    key={farm._id}
                    value={farm._id}
                  >
                    {farm.name}
                  </option>
                ))}
              </select>

              {farmCapacity && (
                <p className="text-xs text-gray-400 mt-1">
                  {t("crop.availableArea", {
                    remaining:
                      farmCapacity.remainingArea.toFixed(1),
                    total: farmCapacity.totalArea,
                    defaultValue: `${farmCapacity.remainingArea.toFixed(
                      1
                    )} of ${
                      farmCapacity.totalArea
                    } acres available`,
                  })}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("crop.sownDate")}
              </label>

              <input
                type="date"
                name="sownDate"
                value={form.sownDate}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("crop.areaInAcres")}
              </label>

              <input
                type="number"
                name="areaInAcres"
                value={form.areaInAcres}
                onChange={handleChange}
                min="0"
                max={farmCapacity?.remainingArea}
                step="0.1"
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm disabled:bg-gray-100"
              />
            </div>

            {isEditMode && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("crop.status")}
                </label>

                {wasAlreadyHarvested ? (
                  <div className="flex items-center gap-2 mt-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500">
                    <Lock size={14} />
                    {t("crop.statusHarvested")} — {t("crop.statusLocked")}
                  </div>
                ) : (
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
                  >
                    {editableStatuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {t(
                          `crop.status${
                            status
                              .charAt(0)
                              .toUpperCase() +
                            status.slice(1)
                          }`
                        )}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : t("common.save")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCropModal;