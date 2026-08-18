import Link from "next/link";

import { TutiMascot } from "./TutiMascot";

const socialLinks = [
  { href: "https://t.me/tutitj", label: "Telegram" },
  { href: "https://instagram.com/tutitj.official", label: "Instagram" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-light py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TutiMascot size={28} />
          <span className="font-bold text-text-dark">Tuti</span>
          <span className="text-text-muted text-sm">© 2026</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link
            href="/privacy"
            className="text-text-muted hover:text-primary transition-colors font-semibold text-sm"
          >
            Политика конфиденциальности
          </Link>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors font-semibold text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
