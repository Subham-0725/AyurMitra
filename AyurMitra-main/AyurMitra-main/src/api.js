// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend
});

export const predictDosha = async (symptoms) => {
  const response = await API.post("/predict", { symptoms });
  return response.data;
};
