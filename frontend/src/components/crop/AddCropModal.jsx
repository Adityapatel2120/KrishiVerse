import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useCrop } from "../../hooks/useCrop";
import { useFarm } from "../../hooks/useFarm";

const cropTypes = ["wheat", "rice", "cotton", "sugarcane", "maize", "groundnut"];
const statuses = ["growing", "harvested", "diseased"];

const emptyForm = (farms) => ({
  type: cropTypes[0],
  farmId: farms[0]?.id || "",
  sownDate: "",
  areaInAcres: "",
  status: "growing",
});

const AddCropModal = ({ isOpen, onClose, cropToEdit = null }) => {
  const { t } = useTranslation();
  const { addCrop, updateCrop } = useCrop();
  const { farms } = useFarm();
  const [form, setForm] = useState(emptyForm(farms));
  const [error, setError] = useState("");

  const isEditMode = Boolean(cropToEdit);

  useEffect(() => {
    if (cropToEdit) {
      setForm({
        type: cropToEdit.type,
        farmId: cropToEdit.farmId,
        sownDate: cropToEdit.sownDate,
        areaInAcres: cropToEdit.areaInAcres,
        status: cropToEdit.status,
      });
    } else {
      setForm(emptyForm(farms));
    }
  }, [cropToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (isEditMode) {
      updateCrop(cropToEdit.id, form);
    } else {
      addCrop(form);
    }

    setForm(emptyForm(farms));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? t("crop.editCrop") : t("crop.addCrop")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {farms.length === 0 ? (
          <p className="text-sm text-gray-500">{t("crop.noFarmsWarning")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">{t("crop.cropType")}</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
              >
                {cropTypes.map((c) => (
                  <option key={c} value={c}>{t(`crops.${c}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">{t("crop.selectFarm")}</label>
              <select
                name="farmId"
                value={form.farmId}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">{t("crop.sownDate")}</label>
              <input
                type="date"
                name="sownDate"
                value={form.sownDate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">{t("crop.areaInAcres")}</label>
              <input
                type="number"
                name="areaInAcres"
                value={form.areaInAcres}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
              />
            </div>

            {isEditMode && (
              <div>
                <label className="text-sm font-medium text-gray-700">{t("crop.status")}</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {t(`crop.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                {t("common.save")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCropModal;