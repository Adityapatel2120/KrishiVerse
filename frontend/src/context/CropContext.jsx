import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getCrops,
  createCrop,
  updateCrop as updateCropAPI,
  deleteCrop as deleteCropAPI,
} from "../api/cropApi";

export const CropContext = createContext(null);

export const CropProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load crops for the logged-in user from MongoDB
  useEffect(() => {
    const loadCrops = async () => {
      if (!currentUser) {
        setCrops([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getCrops(currentUser.uid);

        setCrops(data);
      } catch (error) {
        console.error("Error loading crops:", error);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };

    loadCrops();
  }, [currentUser]);

  // Create a crop in MongoDB
  const addCrop = async (crop) => {
    if (!currentUser) {
      throw new Error("User is not logged in");
    }

    const newCrop = await createCrop({
      userId: currentUser.uid,
      type: crop.type,
      farmId: crop.farmId,
      sownDate: crop.sownDate,
      areaInAcres: Number(crop.areaInAcres),
      status: crop.status || "growing",
    });

    setCrops((prev) => [...prev, newCrop]);

    return newCrop;
  };

  // Update a crop using its MongoDB _id
  const updateCrop = async (id, updates) => {
    const updatedCrop = await updateCropAPI(id, {
      type: updates.type,
      farmId: updates.farmId,
      sownDate: updates.sownDate,
      areaInAcres: Number(updates.areaInAcres),
      status: updates.status,
    });

    setCrops((prev) =>
      prev.map((crop) =>
        crop._id === id ? updatedCrop : crop
      )
    );

    return updatedCrop;
  };

  // Delete a crop using its MongoDB _id
  const deleteCrop = async (id) => {
    await deleteCropAPI(id);

    setCrops((prev) =>
      prev.filter((crop) => crop._id !== id)
    );
  };

  return (
    <CropContext.Provider
      value={{
        crops,
        loading,
        addCrop,
        updateCrop,
        deleteCrop,
      }}
    >
      {children}
    </CropContext.Provider>
  );
};