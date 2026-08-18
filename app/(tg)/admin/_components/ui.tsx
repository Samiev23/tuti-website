"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

/* ─── Логотип Tuti ─── */
export function TutiMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-[10px] gradient-teal-cyan flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="flex gap-[3px] -mt-[1px]">
        <span className="bg-white rounded-full" style={{ width: size * 0.14, height: size * 0.14 }} />
        <span className="bg-white rounded-full" style={{ width: size * 0.14, height: size * 0.14 }} />
      </div>
      <span
        className="absolute bg-accent-yellow"
        style={{
          width: size * 0.13,
          height: size * 0.08,
          bottom: size * 0.26,
          borderRadius: "50% 50% 50% 50% / 0% 0% 100% 100%",
        }}
      />
    </div>
  );
}

/* ─── Кнопка ─── */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
};

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "gradient-teal text-white shadow-sm hover:brightness-105",
  secondary: "bg-white text-text-dark border border-border-light hover:border-primary/50",
  ghost: "bg-transparent text-text-muted hover:bg-primary/5 hover:text-text-dark",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

/* ─── Поля ввода ─── */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-border-light bg-white px-3.5 py-2.5 text-sm font-semibold text-text-dark outline-none transition placeholder:font-medium placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`}
    />
  );
}

/* ─── Поверхности ─── */
export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-border-light bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  loading = false,
  accent = "teal",
  action,
}: {
  label: string;
  value: string | number | null;
  hint?: string;
  loading?: boolean;
  accent?: "teal" | "cyan" | "green" | "yellow";
  action?: ReactNode;
}) {
  const accents: Record<string, string> = {
    teal: "bg-primary",
    cyan: "bg-accent-cyan",
    green: "bg-accent-green",
    yellow: "bg-accent-yellow",
  };

  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute left-0 top-0 h-full w-1 ${accents[accent]}`} />
      <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-text-dark">
        {loading ? (
          <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-border-light align-middle" />
        ) : value === null ? (
          <span className="text-xl text-text-muted">—</span>
        ) : (
          value
        )}
      </p>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-border-light text-text-muted",
    success: "bg-primary/12 text-primary-dark",
    warning: "bg-accent-yellow/25 text-[#8a6d00]",
    danger: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    info: "border-border-light bg-bg-mint text-text-dark",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-primary/30 bg-primary/8 text-primary-dark",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </div>
  );
}

/* ─── Модальное окно ─── */
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-dark/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-extrabold text-text-dark">{title}</h2>
        <div className="mt-4 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
