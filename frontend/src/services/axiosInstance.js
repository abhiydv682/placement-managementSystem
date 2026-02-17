import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  // "http://localhost:8000/api";
  // "https://placement-managementsystem.onrender.com/api";
  "https://placement-managementsystem.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
