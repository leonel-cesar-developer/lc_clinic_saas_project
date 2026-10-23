import { createContext } from "react";
import type { PublicUser } from "../types/user.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<PublicUser>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
