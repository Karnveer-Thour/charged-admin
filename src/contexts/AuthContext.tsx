import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  AuthState,
  Driver,
  Rider,
  DriverDocumentpayload,
  Driverstatuspayload,
  requiredDocuments,
  rideTypes,
  Ride,
  DashboardStats,
  Reward,
  CreateRewardBody,
  ChangeRewardPointsBody,
  RewardPointDetail,
} from "../types";
import {signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
  getAdmin,
  getridersdata,
  getDriversdata,
  getDriverdocsdata,
  updateDriverDocs,
  updateDriverstatus,
  getDocumenttypesdata,
  getRidetypesdata,
  updateRidetypedata,
  getRecentRidesData,
  getDashboardStatsData,
  getRidesDataByUserId,
  getRewards,
  createReward,
  deleteReward,
  getRewardPoints,
  changeRewardPoints,
  deleteRewardPoints,
  deleteUser,
} from "../API/axios";
import toast from "react-hot-toast";

interface AuthContextType {
  authState: AuthState;
  isAuthenticated: boolean;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  getDrivers: () => Promise<Driver[]>;
  getDriverDocs: (id: string) => Promise<any>;
  updateDriverdocsStatus: (
    driverId: string,
    documentId: string,
    data: DriverDocumentpayload
  ) => Promise<any>;
  updateDriveractivestatus: (
    driverId: string,
    data: Driverstatuspayload,
    setError: any
  ) => Promise<any>;
  getDocumenttypes: () => Promise<requiredDocuments[]>;
  getRiders: () => Promise<Rider[]>;
  getRidetypes: () => Promise<rideTypes[]>;
  updateRidetype: (id: number, body: object) => Promise<any>;
  getrecentRides: () => Promise<Ride[]>;
  getRidesByUserId: (id: number) => Promise<Ride[]>;
  getDashboardStats: () => Promise<DashboardStats>;
  getRewardsData: () => Promise<any>;
  createNewReward: (data: CreateRewardBody) => Promise<Reward>;
  deleteExistingReward: (Id: number) => Promise<void>;
  getRewardPointsData: (id: number) => Promise<RewardPointDetail[]>;
  updateRewardPoints: (
    id: number,
    data: ChangeRewardPointsBody
  ) => Promise<void>;
  deleteExistingRewardPoints: (id: number) => Promise<void>;
  deleteExistingUser: (id: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  setAuthState: () => {},
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  getDrivers: async () => {
    return [];
  },
  getDriverDocs: async () => {
    return [];
  },
  updateDriverdocsStatus: async () => {
    return [];
  },
  updateDriveractivestatus: async () => {
    return [];
  },
  getDocumenttypes: async () => {
    return [];
  },
  getRiders: async () => {
    return [];
  },
  getRidetypes: async () => {
    return [];
  },
  updateRidetype: async () => {
    return [];
  },
  getrecentRides: async () => {
    return [];
  },
  getRidesByUserId: async (Id: number) => {
    return [];
  },
  getDashboardStats: async () => {
    return {
      rideCount: "0",
      activeDrivers: "0",
      totalRevenue: "0",
      platformCommission: "0",
      rideTypeCounts: [],
    };
  },
  getRewardsData: async () => {
    return [];
  },
  createNewReward: async (data: CreateRewardBody) => {
    return {
      id: 1,
      title: "anything",
      description: "anything",
      point_required: 100,
      created_at: "Date",
      updated_at: "Date",
    };
  },
  deleteExistingReward: async (Id: number) => {
    return;
  },
  getRewardPointsData: async (id: number) => {
    return [];
  },
  updateRewardPoints: async (id: number, data: ChangeRewardPointsBody) => {
    return;
  },
  deleteExistingRewardPoints: async (id: number) => {
    return;
  },
  deleteExistingUser: async (id: string) => {
    return;
  },
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      setLoading(true);
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem("charged_admin_user");

        if (userData) {
          setAuthState({
            user: JSON.parse(userData),
            error: null,
          });
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleExpiredtoken = (error: any) => {
    if (
      "auth/id-token-expired" === error.response.data.error?.code ||
      "auth/argument-error" === error.response.data.error?.code
    ) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate Firebase authentication
      const userCredential: any = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const User: User = {
        token: userCredential.user?.accessToken,
        id: userCredential.user?.uid,
        name: userCredential.user?.displayName || "Admin",
        email: userCredential.user?.email || email,
        role: "admin",
        createdAt: userCredential.user?.metadata.creationTime,
        photo: userCredential.user?.photoURL || "",
      };
      // Check if the user exists or not
      if (userCredential.user) {
        const userData = await getAdmin(User.token || "");
        //Check if the user is an admin
        if (userData.data.data.user_type !== "admin") {
          setAuthState({
            user: null,
            error: "Enter a valid Admin Credentials",
          });
          return;
        }
        setAuthState({
          user: User,
          error: null,
        });

        toast.success(`${User.name} login successfully!`);
        localStorage.setItem("charged_admin_user", JSON.stringify(User));
      }
    } catch (error) {
      const errorCases: any = {
        "auth/invalid-credential": "Invalid credentials. Please try again.",
        "auth/user-not-found": "No user found with this email.",
        "auth/user-disabled": "This user account has been disabled.",
      };
      setAuthState({
        user: null,
        error:
          errorCases[(error as any).code] || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get drivers

  const getDrivers = async (): Promise<any> => {
    try {
      const drivers: any = await getDriversdata();
      return drivers.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  // Function to get driver documents
  const getDriverDocs = async (id: string): Promise<any> => {
    try {
      const driverDocs: any = await getDriverdocsdata(id);
      return driverDocs.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  // Function to update driver documents

  const updateDriverdocsStatus = async (
    driverId: string,
    documentId: string,
    data: DriverDocumentpayload
  ): Promise<any> => {
    try {
      const driverDocs: any = await updateDriverDocs(
        driverId,
        documentId,
        data
      );
      toast.success(driverDocs.data?.message);
      return driverDocs.data.data[0];
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const updateDriveractivestatus = async (
    driverId: string,
    data: Driverstatuspayload,
    setError: any
  ): Promise<any> => {
    try {
      const driverStatus = await updateDriverstatus(driverId, data);
      toast.success(
        `Driver updated to ${data.is_active ? "active" : "inactive"} successfully`
      );
      return driverStatus.data.data[0];
    } catch (error: any) {
      toast.error(error.response.data?.message);
      setError(error.response.data.mesage);
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getDocumenttypes = async (): Promise<any> => {
    try {
      const documentTypes = await getDocumenttypesdata();
      return documentTypes.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  // Function to get Riders
  const getRiders = async (): Promise<any> => {
    try {
      const riders: any = await getridersdata();
      return riders.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getRidetypes = async (): Promise<any> => {
    try {
      const rideTypes = await getRidetypesdata();
      return rideTypes.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const updateRidetype = async (id: number, body: object): Promise<any> => {
    try {
      await updateRidetypedata(id, body);
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getrecentRides = async (): Promise<any> => {
    try {
      const recentRides = await getRecentRidesData();
      return recentRides.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getRidesByUserId = async (Id: number): Promise<any> => {
    try {
      const RidesByUserId = await getRidesDataByUserId(Id);
      return RidesByUserId.data.data;
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
      return error.response.data.status;
    }
  };

  const getDashboardStats = async (): Promise<any> => {
    try {
      const dashboardStats = await getDashboardStatsData();
      return dashboardStats.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getRewardsData = async (): Promise<any> => {
    try {
      const Rewards = await getRewards();
      return Rewards.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const createNewReward = async (data: CreateRewardBody): Promise<any> => {
    try {
      const newReward = await createReward(data);
      toast.success(newReward.data?.message);
      return newReward.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const deleteExistingReward = async (rewardId: number): Promise<any> => {
    try {
      const deletedReward = await deleteReward(rewardId);
      toast.success(deletedReward.data?.message);
      return deletedReward.data.data;
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const getRewardPointsData = async (userId: number): Promise<any> => {
    try {
      const rewardPoints = await getRewardPoints(userId);
      return rewardPoints.data.data?.rewards;
    } catch (error: any) {
      handleExpiredtoken(error);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const updateRewardPoints = async (
    userId: number,
    data: ChangeRewardPointsBody
  ) => {
    try {
      const changedRewardPoints = await changeRewardPoints(userId, data);
      toast.success(changedRewardPoints.data?.message);
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const deleteExistingRewardPoints = async (rewardPointId: number) => {
    try {
      const deletedRewardPoints = await deleteRewardPoints(rewardPointId);
      toast.success(deletedRewardPoints.data?.message);
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const deleteExistingUser = async (userId: string) => {
    try {
      const deletedUser = await deleteUser(userId);
      toast.success(deletedUser.data?.message);
    } catch (error: any) {
      handleExpiredtoken(error);
      toast.error(error.data?.message);
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.message,
      }));
    }
  };

  const logout = () => {
    // Clear user data from localStorage
    signOut(auth);
    localStorage.removeItem("charged_admin_user");
    toast.success("Logout succesfully");
    // Reset auth state
    setAuthState(initialAuthState);
  };

  const isAuthenticated = !!authState.user;

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        isAuthenticated,
        loading,
        login,
        getDrivers,
        getDriverDocs,
        getDocumenttypes,
        updateDriverdocsStatus,
        updateDriveractivestatus,
        getRidetypes,
        getRiders,
        updateRidetype,
        getrecentRides,
        getRidesByUserId,
        getDashboardStats,
        getRewardsData,
        createNewReward,
        deleteExistingReward,
        getRewardPointsData,
        updateRewardPoints,
        deleteExistingRewardPoints,
        deleteExistingUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
