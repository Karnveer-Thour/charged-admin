import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState, Driver, Rider } from "../types";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getAdmin, getridersdata, getDriversdata } from "../API/axios";

interface AuthContextType {
  authState: AuthState;
  isAuthenticated: boolean;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  getDrivers: () => Promise<Driver[]>;
  getRiders: () => Promise<Rider[]>;
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
  getRiders: async () => {
    return [];
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate Firebase authentication
      const userCredential: any = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // const user=await axios.get(`http://3.20.152.91:3000/api-docs/#/Admin/adminLogin`);
      // console.log(user);
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
        // Store user data in localStorage
        localStorage.setItem("charged_admin_user", JSON.stringify(User));
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage: string;
      switch ((error as any).code) {
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please try again.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user account has been disabled.";
          break;
        default:
          errorMessage = "Login failed. Please try again.";
      }
      setAuthState({
        user: null,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get drivers

  const getDrivers = async (): Promise<Driver[]> => {
    const drivers: any = await getDriversdata();
    return drivers.data.data;
  };

  // Function to get Riders
  const getRiders = async (): Promise<Rider[]> => {
    const riders: any = await getridersdata();
    return riders.data.data;
  };

  const logout = () => {
    // Clear user data from localStorage
    signOut(auth);
    localStorage.removeItem("charged_admin_user");

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
        getRiders,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
