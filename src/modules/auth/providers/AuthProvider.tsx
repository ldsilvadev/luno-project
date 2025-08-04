"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthContext, TUser } from "../contexts/AuthContext";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = localStorage.getItem("luno:user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, user: TUser) => {
    setToken(token);
    setUser(user);
    Cookies.set("token", token, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    localStorage.setItem("luno:user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    localStorage.removeItem("luno:user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
