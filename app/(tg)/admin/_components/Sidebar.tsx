"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAdminAuth } from "./AdminAuth";
import { TutiMark } from "./ui";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  /** Раздел из плана, но ещё не реализован — показываем как Coming Soon. */
  soon?: boolean;
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "◧" },
  { label: "Users", href: "/admin/users", icon: "◍", soon: true },
  { label: "Analytics", href: "/admin/analytics", icon: "◔", soon: true },
  { label: "Courses", href: "/admin/courses", icon: "◈", soon: true },
  { label: "Tuti Plus", href: "/admin/plus", icon: "★", soon: true },
  { label: "Promo Codes", href: "/admin/promo-codes", icon: "◆" },
  { label: "Settings", href: "/admin/settings", icon: "⚙", soon: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { email, signOut } = useAdminAuth();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border-light bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <TutiMark size={34} />
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-text-dark">Tuti Admin</p>
          <p className="text-[11px] font-semibold text-text-muted">tutitj.com</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;

          if (item.soon) {
            return (
              <span
                key={item.href}
                aria-disabled
                title="Скоро"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-text-muted/55"
              >
                <span className="w-4 text-center">{item.icon}</span>
                {item.label}
                <span className="ml-auto rounded-full bg-border-light px-2 py-0.5 text-[10px] font-bold text-text-muted">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                active
                  ? "bg-primary/10 text-primary-dark"
                  : "text-text-dark hover:bg-bg-mint"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-light px-5 py-4">
        <p className="truncate text-xs font-bold text-text-dark" title={email ?? ""}>
          {email}
        </p>
        <button
          onClick={() => void signOut()}
          className="mt-1 text-xs font-bold text-text-muted transition hover:text-red-500"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
