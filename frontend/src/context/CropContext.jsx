import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const CropContext = createContext(null);

export const CropProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = currentUser ? `krishiverse_crops_${currentUser.uid}` : null;

  useEffect(() => {
    if (!storageKey) {
      setCrops([]);
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem(storageKey);
    setCrops(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, [storageKey]);

  const persist = (updated) => {
    setCrops(updated);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addCrop = (crop) => {
    const newCrop = {
      id: `crop_${Date.now()}`,
      type: crop.type,
      farmId: crop.farmId,
      sownDate: crop.sownDate,
      areaInAcres: Number(crop.areaInAcres),
      status: crop.status || "growing",
      createdAt: new Date().toISOString(),
    };
    persist([...crops, newCrop]);
    return newCrop;
  };

  const updateCrop = (id, updates) => {
    const updated = crops.map((c) =>
      c.id === id
        ? { ...c, ...updates, areaInAcres: Number(updates.areaInAcres) }
        : c
    );
    persist(updated);
  };

  const deleteCrop = (id) => {
    persist(crops.filter((c) => c.id !== id));
  };

  return (
    <CropContext.Provider value={{ crops, loading, addCrop, updateCrop, deleteCrop }}>
      {children}
    </CropContext.Provider>
  );
};