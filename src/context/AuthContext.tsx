"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: string;
}

interface IAuthContext {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// JWT decode fonksiyonu (client-side için güvenli)
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      // JWT decode yap (doğrulama server-side'da yapılacak)
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          surname: decoded.surname,
          role: decoded.role
        });
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Token decode hatası:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 60000); // Her dakika kontrol et

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const login = (token: string) => {
    try {
      // Token'ı decode et
      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error("Geçersiz token");
      }
      localStorage.setItem("token", token);
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        surname: decoded.surname,
        role: decoded.role
      });
    } catch (error) {
      console.error("Login token decode hatası:", error);
      throw new Error("Geçersiz token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 