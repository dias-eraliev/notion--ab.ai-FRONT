import { createContext, useContext } from "react";

const AuthContext = createContext({
  token: "",
  setToken: (token: string) => { },
  payload: {} as {
    role: string;
    id: number;
  },
  setPayload: (payload: any) => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;