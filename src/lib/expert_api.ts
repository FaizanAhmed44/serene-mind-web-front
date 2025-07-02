import axios from "axios";

export const expertApi = axios.create({
    baseURL: import.meta.env.VITE_EXPERT_API_URL,
  });
  
  expertApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_EXPERT_SERVICE_KEY}`;
  return config;
});