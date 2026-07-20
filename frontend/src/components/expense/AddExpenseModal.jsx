import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useExpense } from "../../hooks/useExpense";

const categories = ["fertilizer", "seeds", "labor", "equipment", "irrigation"];

const emptyForm = { category: categories[0], amount: "", date: "", note: "" };

const AddExpenseModal = ({ isOpen, onClose, expenseToEdit = null }) => {
  const { t } = useTranslation();
  const { addExpense, updateExpense } = useExpense();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditMode = Boolean(expenseToEdit);

  useEffect(() => {
    if (isOpen && expenseToEdit) {
      setForm({
        category: expenseToEdit.category,
        amount: String(expenseToEdit.amount),
        date: expenseToEdit.date,
        note: expenseToEdit.note || "",
      });
    } else if (isOpen && !expenseToEdit) {
      setForm(emptyForm);
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

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
      updateExpense(expenseToEdit.id, form);
    } else {
      addExpense(form);
    }

    setForm(emptyForm);
    setError("");
    onClose();
  };

  const handleClose = () => {
    setForm(emptyForm);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? t("expense.editExpense") : t("expense.addExpense")}
          </h3>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
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
            <label className="text-sm font-medium text-gray-700">{t("expense.category")}</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{t(`expenseCategories.${c}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("expense.amount")}</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("expense.date")}</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("expense.note")}</label>
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
              onClick={handleClose}
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

export default AddExpenseModal;