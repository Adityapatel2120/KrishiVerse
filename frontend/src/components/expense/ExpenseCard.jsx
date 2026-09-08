import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Trash2, Wallet, Pencil, Tractor, Sprout } from "lucide-react";
import { useExpense } from "../../hooks/useExpense";
import { useFarm } from "../../hooks/useFarm";
import { useCrop } from "../../hooks/useCrop";

const ExpenseCard = ({ expense, onEdit }) => {
  const { t } = useTranslation();
  const { deleteExpense } = useExpense();
  const { farms } = useFarm();
  const { crops } = useCrop();

  const farm = farms.find((f) => f._id === expense.farmId);
  const crop = crops.find((c) => c._id === expense.cropId);

  const handleDelete = () => {
    if (window.confirm(t("expense.deleteConfirm"))) {
      deleteExpense(expense._id);
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
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 flex-wrap">
            <Calendar size={12} />
            {expense.date}
            {expense.note && <span>· {expense.note}</span>}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {farm && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                <Tractor size={10} />
                {farm.name}
              </span>
            )}
            {crop && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                <Sprout size={10} />
                {t(`crops.${crop.type}`)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800">₹{expense.amount.toLocaleString("en-IN")}</span>
        <button onClick={() => onEdit(expense)} className="text-gray-300 hover:text-green-600 transition-colors">
          <Pencil size={16} />
        </button>
        <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;