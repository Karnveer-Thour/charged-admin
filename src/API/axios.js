import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to dynamically set the Authorization header
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("charged_admin_user"));
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAdmin = () => instance.get("/admin");

export const getDriversdata = ()=>instance.get("/admin/getdrivers");

export const getridersdata = () => instance.get("/admin/getriders");