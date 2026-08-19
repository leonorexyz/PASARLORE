"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: "admin" | "customer") => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("pasarlore_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default guest / sample customer for seamless checkout experience
        const defaultUser: User = {
          id: "usr-cust-1",
          name: "Budi Santoso",
          email: "budi.santoso@gmail.com",
          role: "customer",
          createdAt: new Date().toISOString(),
        };
        setUser(defaultUser);
        localStorage.setItem("pasarlore_user", JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error("Failed to load user auth state", e);
    }
  }, []);

  const login = (email: string, name = "Pelanggan PASARLORE", role: "admin" | "customer" = "customer") => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("pasarlore_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pasarlore_user");
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem("pasarlore_user", JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
