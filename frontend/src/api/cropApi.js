import { apiRequest } from "./api";

// Crop API

export const getCrops = (userId) => {
  return apiRequest(`/crops/${userId}`);
};

export const createCrop = (crop) => {
  return apiRequest("/crops", {
    method: "POST",
    body: JSON.stringify(crop),
  });
};

export const updateCrop = (id, updates) => {
  return apiRequest(`/crops/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteCrop = (id) => {
  return apiRequest(`/crops/${id}`, {
    method: "DELETE",
  });
};