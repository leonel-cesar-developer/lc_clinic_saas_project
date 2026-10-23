import { databaseCollections } from "../../fake-api/database";
import { ApiError } from "../core/api-error";
import { simulateNetworkDelay } from "../core/delay";
import { readCollection } from "../core/local-storage";
import type { User, PublicUser } from "../../types/user.types";

const AUTH_SESSION_KEY = "lc-appointments-auth-session";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: PublicUser;
  authenticatedAt: string;
}

function removePassword(user: User): PublicUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await simulateNetworkDelay();
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const users = readCollection<User>(databaseCollections.users);
    const user = users.find(
      (currentUser) => currentUser.email.toLowerCase() === normalizedEmail,
    );

    if (!user || user.password !== credentials.password) {
      throw new ApiError({
        code: "UNAUTHORIZED",
        status: 401,
        message: "Email ou palavra-passe inválidos.",
      });
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError({
        code: "FORBIDDEN",
        status: 403,
        message: "Este utilizador não está autorizado a entrar.",
      });
    }

    const session: AuthSession = {
      user: removePassword(user),
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

    return session;
  },

  async logout(): Promise<void> {
    await simulateNetworkDelay();

    localStorage.removeItem(AUTH_SESSION_KEY);
  },

  getSession(): AuthSession | null {
    const storedSession = localStorage.getItem(AUTH_SESSION_KEY);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthSession;
    } catch {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getSession());
  },
};
