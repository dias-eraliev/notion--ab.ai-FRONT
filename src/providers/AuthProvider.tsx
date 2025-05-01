import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
}

// Определяем доступы к маршрутам по ролям
export const roleAccess: Record<UserRole, string[]> = {
  admin: [
    '/app/dashboard',
    '/app/chat',
    '/app/ai-chat',
    '/app/calendar',
    '/app/email',
    '/app/todo',
    '/app/files',
    '/app/education/*',
    '/app/students/*',
    '/app/hr/*',
    '/app/finance/*',
    '/app/ai-analytics/*',
    '/app/settings/*',
    '/app/erp/*',
    '/academic/*'
  ],
  teacher: [
    '/app/dashboard',
    '/app/chat',
    '/app/ai-chat',
    '/app/calendar',
    '/app/email',
    '/app/todo',
    '/app/files',
    '/app/journal/*',
    '/app/schedule/*',
    '/app/content/*',
    '/app/ai-assistant/*',
    '/academic/*'
  ],
  student: [
    '/app/dashboard',
    '/app/chat',
    '/app/ai-chat',
    '/app/calendar',
    '/app/journal/my',
    '/app/ai-mentor/*',
    '/app/homework/*',
    '/app/chat/teachers',
    '/academic/homework'
  ],
  parent: [
    '/app/dashboard',
    '/app/chat/teachers',
    '/app/progress/*',
    '/app/finance/payments',
    '/app/ai-reports/*',
    '/academic/homework'
  ]
};

const mockUsers: Record<string, User> = {
  'admin@school.edu': {
    id: '1',
    name: 'Администратор',
    role: 'admin',
    email: 'admin@school.edu'
  },
  'teacher@school.edu': {
    id: '2',
    name: 'Учитель',
    role: 'teacher',
    email: 'teacher@school.edu'
  },
  'student@school.edu': {
    id: '3',
    name: 'Ученик',
    role: 'student',
    email: 'student@school.edu'
  },
  'parent@school.edu': {
    id: '4',
    name: 'Родитель',
    role: 'parent',
    email: 'parent@school.edu'
  }
};

const authContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('admin');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    loggedIn === null ? sessionStorage.setItem("loggedIn", "false") : sessionStorage.setItem("loggedIn", "true");
    if (!loggedIn) {
      navigate('/login');
    }
  }, []);

  // Проверяем доступ к текущему маршруту при изменении роли или маршрута
  useEffect(() => {
    if (user) {
      const hasAccess = roleAccess[role].some(path => {
        if (path.endsWith('/*')) {
          const basePath = path.slice(0, -2);
          return location.pathname.startsWith(basePath);
        }
        return path === location.pathname;
      });

      if (!hasAccess) {
        navigate('/app/dashboard');
      }
    }
  }, [role, location.pathname, user]);

  const login = async (email: string, password: string) => {
    // Здесь должна быть реальная логика аутентификации
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
      setRole(mockUser.role);
      navigate('/app/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setRole('admin');
    navigate('/login');
  };

  const hasAccess = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(role);
  };

  return (
    <authContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated: !!user,
        login,
        logout,
        hasAccess
      }}
    >
      {children}
    </authContext.Provider>
  );
};

// Компонент для защиты маршрутов
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { hasAccess, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!hasAccess(allowedRoles)) {
    navigate('/app/dashboard');
    return null;
  }

  return <>{children}</>;
};