"use client";

import { createContext } from "react";

export type TUser = {
  id: string;
  email: string;
  user_name: string;
};

export type TAuthContext = {
  user: TUser | null;
  token: string | null;
  login: (token: string, user: TUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<TAuthContext | null>(null);
