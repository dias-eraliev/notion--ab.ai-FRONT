import { createContext, useContext } from "react";

export interface AuthPayload {
  role: string;
  id: number;
  username: string;
  profile?: {
    id: number;
    name: string;
    surname: string;
    group?: Array<{
      id: number;
      name: string;
    }>;
    groups?: Array<{
      id: number;
      name: string;
    }>;
    Syllabus?: Array<{
      id: number;
      name: string;
      group?: Array<{
        id: number;
        name: string;
      }>;
    }>;
  };
}

const AuthContext = createContext({
  token: "",
  setToken: (token: string) => { },
  payload: {} as AuthPayload,
  setPayload: (payload: AuthPayload) => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;