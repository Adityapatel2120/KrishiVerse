import { useContext } from "react";
import { CropContext } from "../context/CropContext";

export const useCrop = () => {
  const context = useContext(CropContext);
  if (!context) throw new Error("useCrop must be used within a CropProvider");
  return context;
};