import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { api } from './Api';

export type Role = 'superadmin' | 'admin' | 'recepcionista' | 'medico' | 'enfermero';

interface AuthContextType {
  token: string | null;
  role: Role | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<Role | null>(() => {
    const storedRole = localStorage.getItem('role');
    return storedRole === 'superadmin' || storedRole === 'admin' || storedRole === 'recepcionista' || storedRole === 'medico' || storedRole === 'enfermero'
      ? storedRole
      : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);

  const login = async (username: string, password: string): Promise<void> => {
    const res = await api.post('/auth/login', { username, password });
    setToken(res.data.token);
    setRole(res.data.user.role as Role);
  };

  const logout = (): void => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  // Interceptor global para detectar sesión inválida
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          alert(error.response.data.error || 'Tu sesión ha sido cerrada desde otro dispositivo.');
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
