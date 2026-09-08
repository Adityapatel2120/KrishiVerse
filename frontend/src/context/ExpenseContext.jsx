import React, {
  createContext,
  useState,
  useEffect,
} from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getExpenses,
  createExpense,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "../api/expenseApi";

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      if (!currentUser) {
        setExpenses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load expenses belonging to the logged-in user
        const data = await getExpenses(currentUser.uid);

        setExpenses(data);
      } catch (error) {
        console.error("Error loading expenses:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [currentUser]);

  const addExpense = async (expense) => {
    if (!currentUser) {
      throw new Error("User is not logged in");
    }

    // Save farm and crop along with the expense
    const newExpense = await createExpense({
      userId: currentUser.uid,
      farmId: expense.farmId,
      cropId: expense.cropId,
      category: expense.category,
      amount: Number(expense.amount),
      date: expense.date,
      note: expense.note || "",
    });

    setExpenses((prev) => [...prev, newExpense]);

    return newExpense;
  };

  const updateExpense = async (id, updates) => {
    const updatedExpense = await updateExpenseApi(id, {
      farmId: updates.farmId,
      cropId: updates.cropId,
      category: updates.category,
      amount: Number(updates.amount),
      date: updates.date,
      note: updates.note || "",
    });

    setExpenses((prev) =>
      prev.map((expense) =>
        expense._id === id ? updatedExpense : expense
      )
    );

    return updatedExpense;
  };

  const deleteExpense = async (id) => {
    await deleteExpenseApi(id);

    setExpenses((prev) =>
      prev.filter((expense) => expense._id !== id)
    );
  };

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        totalExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};