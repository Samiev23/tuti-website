import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "./_components/AdminShell";

export const metadata: Metadata = {
  title: "Tuti Admin",
  // Панель не должна попадать в поиск, даже если кто-то оставит ссылку.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
