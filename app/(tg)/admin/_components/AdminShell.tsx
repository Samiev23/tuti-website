"use client";

import type { ReactNode } from "react";

import { AdminAuthProvider, useAdminAuth } from "./AdminAuth";
import { LoginScreen } from "./LoginScreen";
import { Sidebar } from "./Sidebar";
import { Notice, Spinner, TutiMark } from "./ui";

const REQUIRED_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_SERVICE_ACCOUNT_KEY",
];

function SetupScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border-light bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <TutiMark size={40} />
          <h1 className="text-xl font-extrabold text-text-dark">Tuti Admin не настроен</h1>
        </div>
        <Notice tone="error">
          Не заданы ключи Firebase. Создайте <code>.env.local</code> по образцу{" "}
          <code>.env.example</code>.
        </Notice>
        <ul className="mt-4 flex flex-col gap-1.5 text-sm font-semibold text-text-muted">
          {REQUIRED_ENV.map((name) => (
            <li key={name} className="rounded-lg bg-bg-mint px-3 py-2 font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Gate({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();

  if (status === "unconfigured") return <SetupScreen />;

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-primary">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (status !== "ready") return <LoginScreen />;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen px-8 py-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <Gate>{children}</Gate>
    </AdminAuthProvider>
  );
}

/** Общая шапка раздела. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-text-dark">{title}</h1>
        {subtitle && <p className="mt-1 text-sm font-semibold text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
