"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

type Status = "loading" | "unconfigured" | "signed-out" | "not-admin" | "ready";

type AdminAuthValue = {
  status: Status;
  email: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** fetch с Bearer-токеном и разбором ошибок API. */
  api: <T>(path: string, init?: RequestInit) => Promise<T>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(isFirebaseConfigured() ? "loading" : "unconfigured");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    return onIdTokenChanged(getFirebaseAuth(), async (next) => {
      if (!next) {
        setUser(null);
        setStatus("signed-out");
        return;
      }
      const token = await next.getIdTokenResult();
      setUser(next);
      // Права живут в custom claim: обычный пользователь Tuti войти сможет,
      // но панель для него останется закрытой.
      setStatus(token.claims.admin === true ? "ready" : "not-admin");
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Claim могли выдать уже после последнего входа — берём свежий токен.
    await cred.user.getIdToken(true);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
  }, []);

  const api = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const current = getFirebaseAuth().currentUser;
      if (!current) throw new Error("Сессия истекла — войдите заново");

      const call = async (forceRefresh: boolean) => {
        const token = await current.getIdToken(forceRefresh);
        return fetch(path, {
          ...init,
          headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
            Authorization: `Bearer ${token}`,
          },
        });
      };

      let res = await call(false);
      if (res.status === 401) res = await call(true);

      const payload = (await res.json().catch(() => ({}))) as T & { error?: string };
      if (!res.ok) throw new Error(payload.error ?? `Ошибка запроса (${res.status})`);
      return payload;
    },
    [],
  );

  const value = useMemo<AdminAuthValue>(
    () => ({ status, email: user?.email ?? null, signIn, signOut, api }),
    [status, user, signIn, signOut, api],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth должен вызываться внутри AdminAuthProvider");
  return ctx;
}
