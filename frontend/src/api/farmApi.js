import { apiRequest } from "./api";

// Farm API

export const getFarms = (userId) => {
  return apiRequest(`/farms/${userId}`);
};

export const createFarm = (farm) => {
  return apiRequest("/farms", {
    method: "POST",
    body: JSON.stringify(farm),
  });
};

export const updateFarm = (id, updates) => {
  return apiRequest(`/farms/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteFarm = (id) => {
  return apiRequest(`/farms/${id}`, {
    method: "DELETE",
  });
};