import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const FarmContext = createContext(null);

export const FarmProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = currentUser ? `krishiverse_farms_${currentUser.uid}` : null;

  useEffect(() => {
    if (!storageKey) {
      setFarms([]);
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem(storageKey);
    setFarms(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, [storageKey]);

  const persist = (updatedFarms) => {
    setFarms(updatedFarms);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updatedFarms));
  };

  const addFarm = (farm) => {
    const newFarm = {
      id: `farm_${Date.now()}`,
      name: farm.name,
      location: farm.location,
      areaInAcres: Number(farm.areaInAcres),
      soilType: farm.soilType,
      createdAt: new Date().toISOString(),
    };
    persist([...farms, newFarm]);
    return newFarm;
  };

  const updateFarm = (id, updates) => {
    const updated = farms.map((f) =>
      f.id === id
        ? { ...f, ...updates, areaInAcres: Number(updates.areaInAcres) }
        : f
    );
    persist(updated);
  };

  const deleteFarm = (id) => {
    persist(farms.filter((f) => f.id !== id));
  };

  return (
    <FarmContext.Provider value={{ farms, loading, addFarm, updateFarm, deleteFarm }}>
      {children}
    </FarmContext.Provider>
  );
};