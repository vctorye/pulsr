import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore doesn't work on web, so fall back to localStorage
const saveToken = (token: string) => {
  if (Platform.OS === 'web') localStorage.setItem('token', token);
  else SecureStore.setItemAsync('token', token);
};
const loadToken = async () => {
  if (Platform.OS === 'web') return localStorage.getItem('token');
  return SecureStore.getItemAsync('token');
};
const deleteToken = () => {
  if (Platform.OS === 'web') localStorage.removeItem('token');
  else SecureStore.deleteItemAsync('token');
};
const saveUser = (user: object) => {
  if (Platform.OS === 'web') localStorage.setItem('user', JSON.stringify(user));
  else SecureStore.setItemAsync('user', JSON.stringify(user));
};
const loadUser = async () => {
  const raw = Platform.OS === 'web'
    ? localStorage.getItem('user')
    : await SecureStore.getItemAsync('user');
  return raw ? JSON.parse(raw) : null;
};
const deleteUser = () => {
  if (Platform.OS === 'web') localStorage.removeItem('user');
  else SecureStore.deleteItemAsync('user');
};

// Shape of the user object we get back from the server
type User = {
  id: number;
  email: string;
  name: string;
  onboarded: boolean;
};

// Everything the context exposes to the rest of the app
type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// Create the context (starts as null until AuthProvider wraps the app)
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadToken(), loadUser()]).then(([t, u]) => {
      if (t) setToken(t);
      if (u) setUser(u);
      setLoading(false);
    });
  }, []);

  // Called after a successful login or signup — saves token to device storage
  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    saveToken(token);
    saveUser(user);
  };

  // Clears everything out
  const logout = () => {
    setToken(null);
    setUser(null);
    deleteToken();
    deleteUser();
  };

  // Wraps the whole app so every screen can access token, user, login, logout
  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook any screen can call: const { token, user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)!;
}
