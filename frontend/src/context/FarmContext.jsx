import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getFarms,
  createFarm,
  updateFarm as updateFarmAPI,
  deleteFarm as deleteFarmAPI,
} from "../api/farmApi";

export const FarmContext = createContext(null);

export const FarmProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load farms for the logged-in user from MongoDB
  useEffect(() => {
    const loadFarms = async () => {
      if (!currentUser) {
        setFarms([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getFarms(currentUser.uid);

        setFarms(data);
      } catch (error) {
        console.error("Error loading farms:", error);
        setFarms([]);
      } finally {
        setLoading(false);
      }
    };

    loadFarms();
  }, [currentUser]);

  // Create a farm in MongoDB
  const addFarm = async (farm) => {
    if (!currentUser) {
      throw new Error("User is not logged in");
    }

    const newFarm = await createFarm({
      userId: currentUser.uid,
      name: farm.name,
      location: farm.location,
      areaInAcres: Number(farm.areaInAcres),
      soilType: farm.soilType,
    });

    setFarms((prev) => [...prev, newFarm]);

    return newFarm;
  };

  // Update a farm using its MongoDB _id
  const updateFarm = async (id, updates) => {
    const updatedFarm = await updateFarmAPI(id, {
      name: updates.name,
      location: updates.location,
      areaInAcres: Number(updates.areaInAcres),
      soilType: updates.soilType,
    });

    setFarms((prev) =>
      prev.map((farm) =>
        farm._id === id ? updatedFarm : farm
      )
    );

    return updatedFarm;
  };

  // Delete a farm using its MongoDB _id
  const deleteFarm = async (id) => {
    await deleteFarmAPI(id);

    setFarms((prev) =>
      prev.filter((farm) => farm._id !== id)
    );
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        loading,
        addFarm,
        updateFarm,
        deleteFarm,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};