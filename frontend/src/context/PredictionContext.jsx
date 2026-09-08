import React, {
  createContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const PredictionContext =
  createContext(null);

const API_URL =
  "http://localhost:5000/api/predictions";

export const PredictionProvider = ({
  children,
}) => {
  const { currentUser } = useAuth();

  const [predictions, setPredictions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!currentUser) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    fetchPredictions();
  }, [currentUser]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/${currentUser.uid}`
      );

      setPredictions(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch predictions:",
        error.response?.data ||
          error.message
      );

      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const addPrediction = async (
    prediction
  ) => {
    if (!currentUser) {
      throw new Error(
        "User is not logged in"
      );
    }

    try {
      const res = await axios.post(
        API_URL,
        {
          userId: currentUser.uid,

          predictedClass:
            prediction.predictedClass,

          confidence: Number(
            prediction.confidence
          ),

          imageName:
            prediction.imageName || "",

          farmId:
            prediction.farmId || "",

          cropId:
            prediction.cropId || "",
        }
      );

      setPredictions((prev) => [
        res.data,
        ...prev,
      ]);

      return res.data;
    } catch (error) {
      console.error(
        "Prediction error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

  const deletePrediction = async (
    id
  ) => {
    await axios.delete(
      `${API_URL}/${id}`
    );

    setPredictions((prev) =>
      prev.filter(
        (prediction) =>
          prediction._id !== id
      )
    );
  };

  const deleteAllPredictions =
    async () => {
      if (!currentUser) return;

      await axios.delete(
        `${API_URL}/all/${currentUser.uid}`
      );

      setPredictions([]);
    };

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        loading,
        addPrediction,
        deletePrediction,
        deleteAllPredictions,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};