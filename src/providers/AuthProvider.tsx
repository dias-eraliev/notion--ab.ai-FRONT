import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthContext, { useAuth } from "../contexts/AuthContext";
import { authApi } from "@/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || "");
  const [payload, setPayload] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false);
      setPayload(null);
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setToken("");
      setPayload(null);
      setLoading(false);
      navigate('/login');
      return;
    }

    setToken(storedToken);
    setLoading(true);
    setError(null);

    authApi.me()
      .then((data) => {
        setPayload(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ошибка загрузки пользователя");
        setPayload(null);
        setLoading(false);
        navigate('/login');
      });
  }, [location.pathname, navigate]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <AuthContext.Provider value={{ token, setToken, payload, setPayload }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, payload } = useAuth();
  if (!token || !payload) {
    return <Navigate to="/login" />;
  }
  return children;
};