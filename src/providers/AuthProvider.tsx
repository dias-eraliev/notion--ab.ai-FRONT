import { createContext, useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
export const AuthContext = createContext({
  token: "",
  setToken: (token: string) => { },
  payload: Object.create(null),
  setPayload: (payload: any) => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [payload, setPayload] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = localStorage.getItem('payload');

    if (!token || !payload) {
      navigate('/login');
      return;
    }

    setToken(token);
    setPayload(JSON.parse(payload || '{}'));
  }, []);

  return <AuthContext.Provider value={{ token, setToken, payload, setPayload }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};