"use client";
import { User } from "@/model/User";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

interface UserState {
  userData: User | null;
  authenticated: boolean;
}

// Create an authContext with initial values
const authContext = createContext<{
  user: UserState;
  login: (userData: User) => void;
  logout: () => void;
}>({
  user: {
    userData: null,
    authenticated: false,
  },
  login: () => {},
  logout: () => {},
});

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap around children components
const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<UserState>({
    userData: null,
    authenticated: false,
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser({
        userData: JSON.parse(userData),
        authenticated: true,
      });
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser({
      userData,
      authenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUser({ userData: null, authenticated: false });
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
