import { useContext } from "react";
import { RevenueContext } from "../context/RevenueContext";

export const useRevenue = () => {
  const context = useContext(RevenueContext);
  if (!context) throw new Error("useRevenue must be used within a RevenueProvider");
  return context;
};