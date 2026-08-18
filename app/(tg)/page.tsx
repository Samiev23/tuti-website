"use client";

import { useEffect, useRef } from "react";

import { SiteFooter } from "@/app/_components/SiteFooter";
import { TutiMascot } from "@/app/_components/TutiMascot";

/**
 * Ссылка на страницу приложения в Google Play.
 * Пока пусто — кнопки показывают «Ба зудӣ дар Google Play» и не кликаются.
 * Впишите сюда адрес, и обе кнопки сами станут рабочими ссылками.
 */
const APP_STORE_URL = "";

/* ─── Появление при скролле ─── */

function FadeUp({
  children,
  className = "",
  delay = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-fade-up");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`opacity-0 ${delay} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Кнопка загрузки ─── */

function DownloadButton({ variant = "solid" }: { variant?: "solid" | "white" }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-bold text-base px-7 py-4 transition-opacity";
  const skin =
    variant === "white"
      ? "bg-white text-primary"
      : "bg-primary text-white";

  if (!APP_STORE_URL) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${base} ${skin} opacity-70 cursor-default`}
      >
        Боргирӣ кунед
      </button>
    );
  }

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${skin} hover:opacity-90`}
    >
      Боргирӣ кунед
    </a>
  );
}

function SoonNote({ tone = "muted" }: { tone?: "muted" | "light" }) {
  if (APP_STORE_URL) return null;
  return (
    <p
      className={`mt-3 text-sm font-semibold ${
        tone === "light" ? "text-white/70" : "text-text-muted"
      }`}
    >
      Ба зудӣ дар Google Play
    </p>
  );
}

/* ─── Корпус телефона ───────────────────────────────────────────
   Экраны ниже — стилизованные, для вёрстки. Когда будут настоящие
   скриншоты, замените содержимое <Phone> на <Image fill … />.
   ────────────────────────────────────────────────────────────── */

function Phone({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-[230px] h-[468px] shrink-0 overflow-hidden rounded-[34px] border-[5px] border-text-dark bg-white shadow-[0_30px_60px_-30px_rgba(26,46,53,0.5)] ${className}`}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2.5">
        <div className="h-1.5 w-14 rounded-full bg-text-dark/15" />
      </div>
      <div className="h-full pt-8">{children}</div>
    </div>
  );
}

function ScreenLessons() {
  const week = ["Д", "С", "Ч", "П", "Ҷ", "Ш", "Я"];
  const topics = [
    { title: "Салом!", progress: 100 },
    { title: "Рақамҳо", progress: 72 },
    { title: "Хӯрок", progress: 30 },
  ];

  return (
    <div className="px-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-text-dark">Дарсҳо</span>
        <span className="rounded-full bg-accent-yellow/25 px-2 py-0.5 text-[9px] font-bold text-text-dark">
          7 рӯз
        </span>
      </div>

      <div className="mt-3 rounded-2xl bg-primary p-3">
        <div className="mb-2 text-[9px] font-bold text-white/90">Силсила</div>
        <div className="flex justify-between">
          {week.map((d, i) => (
            <div
              key={d}
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${
                i < 5 ? "bg-white text-primary" : "bg-white/25 text-white/70"
              }`}
            >
              {i < 5 ? "✓" : d}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 rounded-2xl bg-bg-mint p-3">
        <div className="text-[10px] font-extrabold text-text-dark">
          Забони русӣ
        </div>
        <div className="text-[9px] text-text-muted">Сатҳи 3 · 65%</div>
      </div>

      <div className="mt-2.5 space-y-2">
        {topics.map((t) => (
          <div
            key={t.title}
            className="rounded-xl border border-border-light p-2.5"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-dark">
                {t.title}
              </span>
              <span className="text-[9px] font-bold text-text-muted">
                {t.progress}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-border-light">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenPractice() {
  const chat = [
    { from: "ai", text: "Дирӯз чӣ кор кардӣ?" },
    { from: "me", text: "I go to school." },
    { from: "ai", text: "Наздик! «I went to school» — гузашта." },
  ];

  return (
    <div className="flex h-full flex-col px-3.5 pb-3.5">
      <div className="text-[11px] font-extrabold text-text-dark">
        Муаллими AI
      </div>

      <div className="mt-3 flex-1 space-y-2.5">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-[10px] leading-snug ${
              m.from === "ai"
                ? "bg-bg-mint text-text-dark"
                : "ml-auto bg-primary text-white"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="rounded-full border border-border-light px-3 py-2 text-[10px] text-text-muted">
        Ҷавоб нависед…
      </div>
    </div>
  );
}

function ScreenRanking() {
  const rows = [
    { place: 1, name: "Нозим", xp: 1240 },
    { place: 2, name: "Сабрина", xp: 1180 },
    { place: 3, name: "Шумо", xp: 940, me: true },
    { place: 4, name: "Фаррух", xp: 820 },
  ];

  return (
    <div className="px-3.5">
      <div className="text-[11px] font-extrabold text-text-dark">Душанбе</div>

      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div
            key={r.place}
            className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 ${
              r.me ? "bg-primary/10" : "border border-border-light"
            }`}
          >
            <span className="w-3 text-[10px] font-extrabold text-text-muted">
              {r.place}
            </span>
            <span className="h-6 w-6 rounded-full bg-accent-cyan/25" />
            <span className="flex-1 text-[10px] font-bold text-text-dark">
              {r.name}
            </span>
            <span className="text-[10px] font-extrabold text-primary">
              {r.xp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   СТРАНИЦА
   ═══════════════════════════════════════════ */

const steps = [
  { n: "01", title: "Омӯзед", text: "Дарсҳои кӯтоҳ — рӯзе панҷ дақиқа." },
  { n: "02", title: "Машқ кунед", text: "Кортҳо, шунидан ва навиштан." },
  {
    n: "03",
    title: "Дар хотир нигоҳ доред",
    text: "Такрори интервалӣ калимаро мустаҳкам мекунад.",
  },
];

// Экран «Дарсҳо» уже показан в hero — здесь только то, чего там не было.
const screens = [
  { caption: "Машқ", el: <ScreenPractice /> },
  { caption: "Рейтинги шаҳр", el: <ScreenRanking /> },
];

const reasons = [
  {
    title: "Бе забони мобайнӣ",
    text: "Шумо аз русӣ ба тоҷикӣ тарҷума намекунед — маъно якбора равшан аст.",
  },
  {
    title: "Ройгон",
    text: "Ҳамаи дарсҳо ройгонанд. Tuti Plus ихтиёрӣ аст.",
  },
  {
    title: "Муаллими AI",
    text: "Ҳар вақт савол диҳед ва ҷавоби фаврӣ гиред.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ─── ШАПКА ─── */}
      <header className="sticky top-0 z-50 border-b border-border-light/60 bg-bg-mint/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <TutiMascot size={34} />
            <span className="text-xl font-extrabold text-text-dark">Tuti</span>
          </div>
          {APP_STORE_URL ? (
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Боргирӣ кунед
            </a>
          ) : (
            <span className="text-sm font-semibold text-text-muted">
              Ба зудӣ
            </span>
          )}
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="px-5 pt-14 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_auto] md:gap-10">
          <div>
            <FadeUp>
              <h1 className="text-[36px] font-black leading-[1] tracking-[-0.03em] text-text-dark sm:text-[52px] md:text-[68px]">
                Англисӣ ва русӣ —
                <br />
                <span className="gradient-text">бо тоҷикӣ.</span>
              </h1>
            </FadeUp>

            <FadeUp delay="delay-100">
              <p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted md:text-xl">
                Ҳар қоида ва ҳар калима бо забони модарии шумо шарҳ дода
                мешавад.
              </p>
            </FadeUp>

            <FadeUp delay="delay-200">
              <div className="mt-9">
                <DownloadButton />
                <SoonNote />
              </div>
            </FadeUp>
          </div>

          <FadeUp delay="delay-200" className="flex justify-center md:justify-end">
            <div className="animate-float">
              <Phone>
                <ScreenLessons />
              </Phone>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── КАК РАБОТАЕТ ─── */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black tracking-tight text-text-dark md:text-[40px]">
              Чӣ тавр кор мекунад
            </h2>
          </FadeUp>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <FadeUp
                key={s.n}
                delay={i === 1 ? "delay-100" : i === 2 ? "delay-200" : ""}
              >
                <div className="border-t border-text-dark/15 pt-5">
                  <span className="text-sm font-extrabold text-primary">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold text-text-dark">
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-text-muted">
                    {s.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ПРОДУКТ ─── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <FadeUp>
            <h2 className="text-3xl font-black tracking-tight text-text-dark md:text-[40px]">
              Дар дохили Tuti
            </h2>
          </FadeUp>
        </div>

        <FadeUp delay="delay-100">
          {/* На телефоне — карусель с центрированием карточки, на десктопе — ряд */}
          <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50vw-115px)] pb-6 md:mt-14 md:justify-center md:gap-10 md:overflow-visible md:px-5">
            {screens.map((s) => (
              <div key={s.caption} className="snap-center">
                <Phone>{s.el}</Phone>
                <p className="mt-4 text-center text-sm font-bold text-text-dark">
                  {s.caption}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ─── ПОЧЕМУ TUTI ─── */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black tracking-tight text-text-dark md:text-[40px]">
              Чаро Tuti
            </h2>
          </FadeUp>

          <div className="mt-10 md:mt-14 md:grid md:grid-cols-3 md:gap-12">
            {reasons.map((r, i) => (
              <FadeUp
                key={r.title}
                delay={i === 1 ? "delay-100" : i === 2 ? "delay-200" : ""}
              >
                <div className="border-t border-text-dark/15 py-6 md:py-0 md:pt-6">
                  <h3 className="text-xl font-extrabold text-text-dark">
                    {r.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-text-muted">
                    {r.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ФИНАЛЬНЫЙ CTA ─── */}
      <section className="bg-primary px-5 py-20 md:py-28">
        <FadeUp>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <TutiMascot size={56} />
            <h2 className="mt-7 text-[32px] font-black leading-[1.05] tracking-[-0.02em] text-white md:text-[46px]">
              Забони худ.
              <br />
              Суръати худ.
            </h2>
            <div className="mt-9">
              <DownloadButton variant="white" />
              <SoonNote tone="light" />
            </div>
          </div>
        </FadeUp>
      </section>

      <SiteFooter />
    </div>
  );
}
