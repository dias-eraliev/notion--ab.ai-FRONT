import { createContext, useState, useContext, useEffect, useLayoutEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthContext, { useAuth } from "../contexts/AuthContext";
import { authApi } from "@/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || "");
  const [payload, setPayload] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (location.pathname === '/login') {
      return;
    }
    authApi.me().then(setPayload);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/login') {
      return;
    }
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }

    setToken(storedToken);
  }, [location.pathname]);

  return <AuthContext.Provider value={{ token, setToken, payload, setPayload }}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, payload } = useAuth();
  if (!token || !payload) {
    return <Navigate to="/login" />;
  }
  return children;
};