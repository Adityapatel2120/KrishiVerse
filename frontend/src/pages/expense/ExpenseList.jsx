import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Wallet } from "lucide-react";
import { useExpense } from "../../hooks/useExpense";
import ExpenseCard from "../../components/expense/ExpenseCard";
import AddExpenseModal from "../../components/expense/AddExpenseModal";

const ExpenseList = () => {
  const { t } = useTranslation();
  const { expenses, loading, totalExpense } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const handleAddClick = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("expense.title")}</h1>
          <p className="text-gray-500 text-sm">{t("expense.subtitle")}</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          {t("expense.addExpense")}
        </button>
      </div>

      {!loading && expenses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <span className="text-gray-500 text-sm font-medium">{t("expense.total")}</span>
          <span className="text-xl font-bold text-gray-800">₹{totalExpense.toLocaleString("en-IN")}</span>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">{t("common.loading")}</div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-gray-400">
          <Wallet size={36} />
          <p className="mt-3 text-sm">{t("expense.noExpenses")}</p>
          <button onClick={handleAddClick} className="mt-4 text-green-600 font-medium text-sm hover:underline">
            {t("expense.addFirstExpense")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onEdit={handleEditClick} />
          ))}
        </div>
      )}

      <AddExpenseModal isOpen={isModalOpen} onClose={handleClose} expenseToEdit={expenseToEdit} />
    </div>
  );
};

export default ExpenseList;