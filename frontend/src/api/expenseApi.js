import { apiRequest } from "./api";

export const getExpenses = (userId) => {
  return apiRequest(`/expenses/${userId}`);
};

export const createExpense = (expense) => {
  return apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
};

export const updateExpense = (id, updates) => {
  return apiRequest(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteExpense = (id) => {
  return apiRequest(`/expenses/${id}`, {
    method: "DELETE",
  });
};