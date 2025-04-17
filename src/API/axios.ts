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
    const userString = localStorage.getItem("charged_admin_user");
    const user = JSON.parse(userString as string);
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getAdmin = (token: string) =>
  instance.get("/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getDriversdata = () => instance.get("/admin/getdrivers");

export const getDriverdocsdata=(id:string)=>instance.get(`/admin/getdriverdocs/${id}`);

export const getridersdata = () => instance.get("/admin/getriders");

