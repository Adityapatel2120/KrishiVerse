import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const RevenueContext = createContext(null);
const API_URL = "http://localhost:5000/api/revenues";

export const RevenueProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setRevenues([]);
      setLoading(false);
      return;
    }
    fetchRevenues();
  }, [currentUser]);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${currentUser.uid}`);
      setRevenues(res.data);
    } catch (err) {
      console.error("Failed to fetch revenues", err);
    }
    setLoading(false);
  };

  const addRevenue = async (revenue) => {
    const res = await axios.post(API_URL, { ...revenue, amount: Number(revenue.amount), userId: currentUser.uid });
    setRevenues((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateRevenue = async (id, updates) => {
    const res = await axios.put(`${API_URL}/${id}`, { ...updates, amount: Number(updates.amount) });
    setRevenues((prev) => prev.map((r) => (r._id === id ? res.data : r)));
  };

  const deleteRevenue = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setRevenues((prev) => prev.filter((r) => r._id !== id));
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  const getRevenueForCrop = (cropId) => revenues.find((r) => r.cropId === cropId);

  return (
    <RevenueContext.Provider
      value={{ revenues, loading, addRevenue, updateRevenue, deleteRevenue, totalRevenue, getRevenueForCrop }}
    >
      {children}
    </RevenueContext.Provider>
  );
};