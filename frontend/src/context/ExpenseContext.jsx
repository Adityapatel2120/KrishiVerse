import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = currentUser ? `krishiverse_expenses_${currentUser.uid}` : null;

  useEffect(() => {
    if (!storageKey) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem(storageKey);
    setExpenses(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, [storageKey]);

  const persist = (updated) => {
    setExpenses(updated);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addExpense = (expense) => {
    const newExpense = {
      id: `expense_${Date.now()}`,
      category: expense.category,
      amount: Number(expense.amount),
      date: expense.date,
      note: expense.note || "",
      createdAt: new Date().toISOString(),
    };
    persist([...expenses, newExpense]);
    return newExpense;
  };

  const updateExpense = (id, updates) => {
    const updated = expenses.map((e) =>
      e.id === id ? { ...e, ...updates, amount: Number(updates.amount) } : e
    );
    persist(updated);
  };

  const deleteExpense = (id) => {
    persist(expenses.filter((e) => e.id !== id));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ExpenseContext.Provider
      value={{ expenses, loading, addExpense, updateExpense, deleteExpense, totalExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};