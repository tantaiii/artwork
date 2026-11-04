import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../Interfaces/UserInterface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const navigate = useNavigate();
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  };

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
      withCredentials: true,
    });
    navigate("/");
  };

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const setLoading = (loading: boolean) => setLoadingState(loading);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        logout,
        user,
        setUser,
        setLoading,
        isLoading: loadingState,
      }}>
      {/* LOADING WHEN FETCH API */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }} open={loadingState}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện lợi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
