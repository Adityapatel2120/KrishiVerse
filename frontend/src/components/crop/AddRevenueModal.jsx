import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, IndianRupee } from "lucide-react";
import { useRevenue } from "../../hooks/useRevenue";

const AddRevenueModal = ({ isOpen, onClose, crop, existingRevenue = null }) => {
  const { t } = useTranslation();
  const { addRevenue, updateRevenue } = useRevenue();
  const [form, setForm] = useState({ amount: "", date: "", buyerName: "", note: "" });
  const [error, setError] = useState("");

  const isEditMode = Boolean(existingRevenue);

  useEffect(() => {
    if (existingRevenue) {
      setForm({
        amount: String(existingRevenue.amount),
        date: existingRevenue.date,
        buyerName: existingRevenue.buyerName || "",
        note: existingRevenue.note || "",
      });
    } else {
      setForm({ amount: "", date: "", buyerName: "", note: "" });
    }
  }, [existingRevenue, isOpen]);

  if (!isOpen || !crop) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.date) {
      setError(t("farm.fillAllFields"));
      return;
    }
    if (Number(form.amount) <= 0) {
      setError(t("farm.areaInvalid"));
      return;
    }

    if (isEditMode) {
      updateRevenue(existingRevenue._id, form);
    } else {
      addRevenue({ ...form, cropId: crop._id, farmId: crop.farmId });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? t("revenue.editRevenue") : t("revenue.addRevenue")}
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
            <label className="text-sm font-medium text-gray-700">{t("revenue.amount")}</label>
            <div className="relative mt-1">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("revenue.date")}</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("revenue.buyerName")}</label>
            <input
              type="text"
              name="buyerName"
              value={form.buyerName}
              onChange={handleChange}
              placeholder={t("revenue.buyerNamePlaceholder")}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("revenue.note")}</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
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

export default AddRevenueModal;