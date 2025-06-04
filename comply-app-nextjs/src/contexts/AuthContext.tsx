import React from 'react';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

// Criar o contexto de autenticação
interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{user: User, token: string}>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há um usuário logado ao carregar o componente
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Função de login
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    setCurrentUser(response.user);
    return response;
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Valor do contexto
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
