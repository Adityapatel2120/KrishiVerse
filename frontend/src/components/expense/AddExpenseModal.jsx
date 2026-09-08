import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useExpense } from "../../hooks/useExpense";
import { useFarm } from "../../hooks/useFarm";
import { useCrop } from "../../hooks/useCrop";

const categories = [
  "fertilizer",
  "seeds",
  "labor",
  "equipment",
  "irrigation",
];

const emptyForm = {
  farmId: "",
  cropId: "",
  category: categories[0],
  amount: "",
  date: "",
  note: "",
};

const AddExpenseModal = ({
  isOpen,
  onClose,
  expenseToEdit = null,
}) => {
  const { t } = useTranslation();

  const {
    addExpense,
    updateExpense,
  } = useExpense();

  const { farms } = useFarm();
  const { crops } = useCrop();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(expenseToEdit);

  const availableCrops = useMemo(() => {
    if (!form.farmId) return [];

    return crops.filter(
      (crop) => crop.farmId === form.farmId
    );
  }, [crops, form.farmId]);

  useEffect(() => {
    if (!isOpen) return;

    if (expenseToEdit) {
      setForm({
        farmId: expenseToEdit.farmId || "",
        cropId: expenseToEdit.cropId || "",
        category: expenseToEdit.category || categories[0],
        amount: String(expenseToEdit.amount ?? ""),
        date: expenseToEdit.date || "",
        note: expenseToEdit.note || "",
      });
    } else {
      setForm({
        ...emptyForm,
        farmId: farms[0]?._id || "",
        cropId: "",
      });
    }

    setError("");
    setSaving(false);
  }, [expenseToEdit, isOpen, farms]);

  useEffect(() => {
    if (!form.farmId) {
      setForm((prev) => ({
        ...prev,
        cropId: "",
      }));
      return;
    }

    const selectedCropExists = availableCrops.some(
      (crop) => crop._id === form.cropId
    );

    if (!selectedCropExists) {
      setForm((prev) => ({
        ...prev,
        cropId: availableCrops[0]?._id || "",
      }));
    }
  }, [form.farmId, availableCrops]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "farmId") {
      setForm((prev) => ({
        ...prev,
        farmId: value,
        cropId: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.farmId) {
      setError(t("expense.farmRequired", "Please select a farm."));
      return;
    }

    if (!form.cropId) {
      setError(t("expense.cropRequired", "Please select a crop."));
      return;
    }

    if (!form.amount || !form.date) {
      setError(t("farm.fillAllFields"));
      return;
    }

    if (Number(form.amount) <= 0) {
      setError(t("farm.areaInvalid"));
      return;
    }

    try {
      setSaving(true);

      const expenseData = {
        farmId: form.farmId,
        cropId: form.cropId,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        note: form.note,
      };

      if (isEditMode) {
        // MongoDB identifies the expense using _id
        await updateExpense(
          expenseToEdit._id,
          expenseData
        );
      } else {
        // Create the expense in MongoDB
        await addExpense(expenseData);
      }

      setForm(emptyForm);
      setError("");
      onClose();
    } catch (err) {
      console.error("Error saving expense:", err);

      setError(
        err.message ||
          t("expense.saveFailed", "Failed to save expense. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    setForm(emptyForm);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode
              ? t("expense.editExpense")
              : t("expense.addExpense")}
          </h3>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {farms.length === 0 ? (
          <div className="text-sm text-gray-500">
            {t("expense.needFarmFirst", "Please add a farm before adding an expense.")}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("expense.linkFarm", "Farm")}
              </label>

              <select
                name="farmId"
                value={form.farmId}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {t("expense.selectFarm", "Select farm")}
                </option>

                {farms.map((farm) => (
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
                {t("expense.linkCrop", "Crop")}
              </label>

              <select
                name="cropId"
                value={form.cropId}
                onChange={handleChange}
                disabled={
                  saving ||
                  !form.farmId ||
                  availableCrops.length === 0
                }
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {!form.farmId
                    ? t("expense.selectFarmFirst", "Select farm first")
                    : availableCrops.length === 0
                    ? t("expense.noCropsOnFarm", "No crops on this farm")
                    : t("expense.selectCrop", "Select crop")}
                </option>

                {availableCrops.map((crop) => (
                  <option
                    key={crop._id}
                    value={crop._id}
                  >
                    {t(`crops.${crop.type}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("expense.category")}
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white disabled:bg-gray-100"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {t(
                      `expenseCategories.${category}`
                    )}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("expense.amount")}
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("expense.date")}
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("expense.note")}
              </label>

              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                disabled={saving}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
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
                  ? t("common.saving", "Saving...")
                  : t("common.save")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddExpenseModal;