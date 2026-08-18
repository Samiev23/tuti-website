"use client";

import { useState, type FormEvent } from "react";

import { useAdminAuth } from "./AdminAuth";
import { Button, Field, Input, Notice, TutiMark } from "./ui";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Неверная почта или пароль",
  "auth/invalid-email": "Некорректный адрес почты",
  "auth/user-disabled": "Аккаунт отключён",
  "auth/too-many-requests": "Слишком много попыток — повторите позже",
  "auth/network-request-failed": "Нет связи с Firebase",
};

export function LoginScreen() {
  const { signIn, status, signOut, email } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(form.email.trim(), form.password);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(FIREBASE_ERRORS[code] ?? "Не удалось войти. Проверьте данные.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <TutiMark size={52} />
          <div>
            <h1 className="text-2xl font-extrabold text-text-dark">Tuti Admin</h1>
            <p className="mt-1 text-sm font-semibold text-text-muted">
              Панель управления. Только для администраторов.
            </p>
          </div>
        </div>

        {status === "not-admin" ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border-light bg-white p-6">
            <Notice tone="error">
              Аккаунт {email} не имеет прав администратора.
            </Notice>
            <Button variant="secondary" onClick={() => void signOut()}>
              Выйти и войти другим аккаунтом
            </Button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-border-light bg-white p-6"
          >
            <Field label="Почта">
              <Input
                type="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@tutitj.com"
              />
            </Field>
            <Field label="Пароль">
              <Input
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>

            {error && <Notice tone="error">{error}</Notice>}

            <Button type="submit" loading={busy}>
              Войти
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-text-muted">
          Вход через Firebase Authentication проекта tuti-tj
        </p>
      </div>
    </div>
  );
}
