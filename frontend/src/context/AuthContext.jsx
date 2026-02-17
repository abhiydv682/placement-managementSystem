import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET CURRENT USER
  ========================== */

  const getCurrentUser = async () => {
    try {
      const { data } =
        await axiosInstance.get("/auth/me");

      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  /* =========================
     LOGIN
  ========================== */

  const login = async (email, password) => {
    try {
      const { data } =
        await axiosInstance.post(
          "/auth/login",
          { email, password }
        );

      setUser(data.user);
      toast.success("Login successful 🚀");

      return data.user; // 🔥 VERY IMPORTANT
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Login failed"
      );
      throw err; // 🔥 allow caller to handle
    }
  };

  /* =========================
     REGISTER
  ========================== */

  const register = async (
    name,
    email,
    password,
    role = "student"
  ) => {
    try {
      const { data } =
        await axiosInstance.post(
          "/auth/register",
          { name, email, password, role }
        );

      setUser(data.user);
      toast.success("Account created 🎉");

      return data.user; // 🔥 VERY IMPORTANT
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Register failed"
      );
      throw err;
    }
  };

  /* =========================
     LOGOUT
  ========================== */

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logged out 👋");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
