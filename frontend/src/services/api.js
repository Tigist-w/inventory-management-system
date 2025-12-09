import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASEURL,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("imsToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default API;
