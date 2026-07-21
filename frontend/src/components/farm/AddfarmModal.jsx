import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useFarm } from "../../hooks/useFarm";

const soilTypes = ["Loamy", "Clay", "Sandy", "Silty", "Black Cotton"];

const emptyForm = { name: "", location: "", areaInAcres: "", soilType: soilTypes[0] };

const AddFarmModal = ({ isOpen, onClose, farmToEdit = null }) => {
  const { t } = useTranslation();
  const { addFarm, updateFarm } = useFarm();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditMode = Boolean(farmToEdit);

  useEffect(() => {
    if (farmToEdit) {
      setForm({
        name: farmToEdit.name,
        location: farmToEdit.location,
        areaInAcres: farmToEdit.areaInAcres,
        soilType: farmToEdit.soilType,
      });
    } else {
      setForm(emptyForm);
    }
  }, [farmToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.location.trim() || !form.areaInAcres) {
      setError(t("farm.fillAllFields"));
      return;
    }
    if (Number(form.areaInAcres) <= 0) {
      setError(t("farm.areaInvalid"));
      return;
    }

    if (isEditMode) {
      updateFarm(farmToEdit.id, form);
    } else {
      addFarm(form);
    }

    setForm(emptyForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? t("farm.editFarm") : t("farm.addFarm")}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">{t("farm.farmName")}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("farm.farmNamePlaceholder")}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("farm.location")}</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder={t("farm.locationPlaceholder")}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("farm.area")}</label>
            <input
              type="number"
              name="areaInAcres"
              value={form.areaInAcres}
              onChange={handleChange}
              placeholder={t("farm.areaPlaceholder")}
              min="0"
              step="0.1"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("farm.soilType")}</label>
            <select
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
            >
              {soilTypes.map((soil) => (
                <option key={soil} value={soil}>{t(`soilTypes.${soil}`)}</option>
              ))}
            </select>
          </div>

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
      </div>
    </div>
  );
};

export default AddFarmModal;