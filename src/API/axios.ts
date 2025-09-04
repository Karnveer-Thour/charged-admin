import axios from "axios";
import {
  ChangeRewardPointsBody,
  CreateRewardBody,
  DriverDocumentpayload,
  Driverstatuspayload,
} from "../types";

// This file contains the API calls for the admin panel

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
  }
);

// Api to get admin data
// This API is used to get the admin data
// It takes the token as a parameter
// and returns the admin data

export const getAdmin = (token: string) =>
  instance.get("/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Api to get all drivers
// This API is used to get all drivers
// It returns an array of drivers
// It is used in the Drivers component

export const getDriversdata = () => instance.get("/admin/getdrivers");

// Api to get driver documents
// This API is used to get the driver documents
// It takes the driverId as a parameter
// and returns array of the driver documents

export const getDriverdocsdata = (id: string) =>
  instance.get(`/admin/getdriverdocs/${id}`);

// Api to update driver documents
// This API is used to update the driver documents
// It takes the driverId and documentId as parameters
// and the data to be updated as the request body
// It returns the updated driver documents
// It is used in the DriverDocuments component

export const updateDriverDocs = (
  driverId: string,
  documentId: string,
  data: DriverDocumentpayload
) => instance.put(`/admin/verifydriverdoc/${driverId}/${documentId}`, data);

// Api to get update driver status
// It is used in the Drivers component

export const updateDriverstatus = (
  driverId: string,
  data: Driverstatuspayload
) => {
  return instance.put(`/admin/updatestatus/${driverId}`, data);
};

// Api to get all document types
// This API is used to get all document types
// It returns an array of document types
// It is used in the documents component

export const getDocumenttypesdata = () => instance.get("/admin/documenttypes");

// Api to get all riders
// This API is used to get all riders
// It returns an array of riders
// It is used in the Riders component

export const getridersdata = () => instance.get("/admin/getriders");

// Api to get all Ridetypes
// This API is used to get all ridetypes
// It returns an array of ridetypes
// It is used in the pricing component

export const getRidetypesdata = () => instance.get("/ride/ridetype");

// Api to update Ridetype
// This API is used to update a particular ridetypes
// It returns result of task
// It is used in the pricing component

export const updateRidetypedata = (id: number, body: object) =>
  instance.put(`/ride/ridetype/${id}`, body);

// Api to get Rides
// This API is used to get all rides
// It returns the array of rides
// It is used in the dashboard page

export const getRecentRidesData = () => instance.get("/ride");

// Api to get rides data on basis of userId
// It returns the array of rides
// It is used in the riders and drivers page

export const getRidesDataByUserId = (Id: number) =>
  instance.get(`admin/ride/userrides/${Id}`);

// Api to get dashboard Stats
// This API is used to get all dashboard data
// It returns the object of dashboard stats
// It is used in the dashboard page

export const getDashboardStatsData = () =>
  instance.get("/admin/dashboardstats");

export const getRewards = () => instance.get("/admin/rewards");

export const createReward = (data: CreateRewardBody) =>
  instance.post("/admin/rewards", data);

export const deleteReward = (rewardId: number) =>
  instance.delete(`/admin/rewards/${rewardId}`);

export const getRewardPoints = (userId: number) =>
  instance.get(`/admin/rewardpoints/${userId}`);

export const changeRewardPoints = (
  userId: number,
  data: ChangeRewardPointsBody
) => instance.post(`/admin/rewardpoints/${userId}`, data);

export const deleteRewardPoints = (rewardPointId: number) =>
  instance.delete(`/admin/rewardpoints/${rewardPointId}`);

export const deleteDriver = (driverId: string) =>
  instance.delete(`/admin/deleteusers/${driverId}`);
