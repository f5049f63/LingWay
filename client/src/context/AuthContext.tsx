import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "../lib/api";

export type User = { id: string; email: string; name: string; role: "USER" | "ADMIN" };

export interface AuthState {
  /** undefined: ещё проверяем, null: не вошли */
  user: User | null | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

/** Хранит текущего пользователя. При запуске спрашивает у сервера, есть ли вход (cookie). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    api<{ user: User }>("/api/auth/me")
      .then((r) => alive && setUser(r.user))
      .catch((e) => {
        // 401 это обычное «не вошли», остальное тоже не должно ломать сайт
        if (alive) setUser(null);
        if (!(e instanceof ApiError) || e.status !== 401) console.warn(e);
      });
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(r.user);
  }, []);

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
