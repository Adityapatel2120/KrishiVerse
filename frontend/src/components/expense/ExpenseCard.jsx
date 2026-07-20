import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Trash2, Wallet, Pencil } from "lucide-react";
import { useExpense } from "../../hooks/useExpense";

const ExpenseCard = ({ expense, onEdit }) => {
  const { t } = useTranslation();
  const { deleteExpense } = useExpense();

  const handleDelete = () => {
    if (window.confirm(t("expense.deleteConfirm"))) {
      deleteExpense(expense.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
          <Wallet size={18} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{t(`expenseCategories.${expense.category}`)}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
            <Calendar size={12} />
            {expense.date}
            {expense.note && <span>· {expense.note}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800">₹{expense.amount.toLocaleString("en-IN")}</span>
        <button
          type="button"
          onClick={() => onEdit(expense)}
          className="text-gray-300 hover:text-green-600 transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;