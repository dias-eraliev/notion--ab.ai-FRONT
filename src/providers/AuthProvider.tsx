import { createContext, useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthContext, { useAuth } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || "");
  const [payload, setPayload] = useState<any>(localStorage.getItem('payload') || null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedPayload = localStorage.getItem('payload');

    if (!storedToken || !storedPayload) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }

    setToken(storedToken);
    setPayload(JSON.parse(storedPayload || "{}"));
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