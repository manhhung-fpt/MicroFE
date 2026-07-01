import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

const mockUser: User = {
  id: 1,
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@example.com',
  phone: '0901234567',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  avatar: 'NVA',
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);

  const login = (_email: string, _password: string) => setUser(mockUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
