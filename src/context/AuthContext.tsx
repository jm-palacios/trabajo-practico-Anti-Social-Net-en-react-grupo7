import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

// 1. Definimos qué cosas va a compartir nuestro contexto con toda la app
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 2. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el Provider (el componente que va a envolver a toda la app en App.tsx)
export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializamos el estado leyendo localStorage para mantener la sesión al recargar (F5)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook personalizado para usar el contexto fácil en cualquier pantalla
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}