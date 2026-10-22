import { useCallback, useMemo, useState, type PropsWithChildren } from "react";

import { authService } from "../api/auth/auth.service";

import {
  AuthContext,
  type AuthContextValue,
  type LoginCredentials,
} from "./auth.context";

import type { PublicUser } from "../types/user.types";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<PublicUser | null>(
    () => authService.getSession()?.user ?? null,
  );

  const isInitializing = false;

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<PublicUser> => {
      const session = await authService.login(credentials);

      setUser(session.user);

      return session.user;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
