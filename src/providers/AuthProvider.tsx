import { createContext, useContext, useState } from 'react';

type authContextType = {
    role: string;
    setRole: (role: string) => void;
}

const authContext = createContext<authContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string>('');

    return (
        <authContext.Provider value={{ role, setRole }}>
            {children}
        </authContext.Provider>
    )
}