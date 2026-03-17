"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Mascot Component ─── */
function TutiMascot({ size = 36 }: { size?: number }) {
  const eyeSize = size * 0.15;
  const beakSize = size * 0.12;
  return (
    <div
      className="relative flex-shrink-0 rounded-full flex items-center justify-center gradient-teal-cyan"
      style={{ width: size, height: size }}
    >
      <div className="flex gap-[3px] -mt-[2px]">
        <div
          className="bg-white rounded-full"
          style={{ width: eyeSize, height: eyeSize }}
        />
        <div
          className="bg-white rounded-full"
          style={{ width: eyeSize, height: eyeSize }}
        />
      </div>
      <div
        className="absolute bg-accent-yellow rounded-full"
        style={{
          width: beakSize,
          height: beakSize * 0.6,
          bottom: size * 0.22,
          borderRadius: "50% 50% 50% 50% / 0% 0% 100% 100%",
        }}
      />
      <div
        className="absolute bg-accent-green rounded-full"
        style={{
          width: size * 0.1,
          height: size * 0.18,
          top: -size * 0.06,
          left: size * 0.38,
          transform: "rotate(-10deg)",
          borderRadius: "50% 50% 50% 50%",
        }}
      />
    </div>
  );
}

/* ─── Fade-Up on Scroll Observer ─── */
function useFadeUp() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeUp({
  children,
  className = "",
  delay = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`opacity-0 ${delay} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Phone Mockup ─── */
function PhoneMockup() {
  return (
    <div className="animate-float">
      <div
        className="relative rounded-[32px] border-[3px] border-text-dark/80 bg-white overflow-hidden shadow-2xl"
        style={{ width: 220, height: 440 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[8px] font-bold text-text-dark">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>●●●</span>
          </div>
        </div>

        {/* App header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-light">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full gradient-teal-cyan flex items-center justify-center">
              <span className="text-[6px] text-white">◠◠</span>
            </div>
            <span className="text-[10px] font-bold text-text-dark">Tuti</span>
          </div>
          <div className="flex gap-1.5">
            <div className="bg-accent-yellow/20 rounded-full px-1.5 py-0.5 text-[7px] font-bold text-text-dark">
              🔥 7
            </div>
            <div className="bg-primary/10 rounded-full px-1.5 py-0.5 text-[7px] font-bold text-primary">
              ⭐ 240
            </div>
          </div>
        </div>

        {/* Streak card */}
        <div className="mx-3 mt-2 rounded-xl gradient-teal p-2.5">
          <div className="text-[8px] font-bold text-white mb-1.5">
            Силсилаи ҳафтагӣ
          </div>
          <div className="flex gap-1.5 justify-between">
            {["Д", "С", "Ч", "П", "Ҷ", "Ш", "Я"].map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold ${
                    i < 5
                      ? "bg-white text-primary"
                      : "bg-white/30 text-white/70"
                  }`}
                >
                  {i < 5 ? "✓" : d}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language card */}
        <div className="mx-3 mt-2 rounded-xl bg-bg-mint p-2.5 flex items-center gap-2">
          <span className="text-lg">🇷🇺</span>
          <div>
            <div className="text-[9px] font-bold text-text-dark">
              Забони русӣ
            </div>
            <div className="text-[7px] text-text-muted">Сатҳ 3 · 65%</div>
          </div>
        </div>

        {/* Topic cards */}
        <div className="px-3 mt-2 space-y-1.5">
          {[
            { title: "Салом!", progress: 100, emoji: "👋" },
            { title: "Рақамҳо", progress: 72, emoji: "🔢" },
            { title: "Хӯрок", progress: 30, emoji: "🍎" },
          ].map((topic) => (
            <div
              key={topic.title}
              className="flex items-center gap-2 bg-white rounded-lg border border-border-light p-1.5"
            >
              <span className="text-sm">{topic.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-bold text-text-dark">
                  {topic.title}
                </div>
                <div className="w-full h-1 bg-border-light rounded-full mt-0.5">
                  <div
                    className="h-full rounded-full gradient-teal"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-[7px] text-text-muted font-bold">
                {topic.progress}%
              </span>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-2 border-t border-border-light bg-white">
          {["🏠", "📚", "🏆", "👤"].map((icon) => (
            <span key={icon} className="text-sm opacity-60">
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const navLinks = [
    { label: "Имконият", href: "#features" },
    { label: "Чӣ тавр?", href: "#how" },
    { label: "Дар бора", href: "#about" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
      setEmail("");
    }
  }

  function scrollTo(href: string) {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border-light/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 cursor-pointer"
          >
            <TutiMascot size={36} />
            <span className="text-2xl font-extrabold text-text-dark">
              Tuti
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollTo("#about")}
            className="hidden md:block gradient-teal text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Боргирӣ кун
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border-light px-5 pb-4 pt-2 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-base font-semibold text-text-dark hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#about")}
              className="w-full gradient-teal text-white font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Боргирӣ кун
            </button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left column */}
          <div className="flex-1 max-w-xl">
            <FadeUp>
              <div className="inline-flex items-center gap-2 bg-accent-cyan/10 text-text-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
                🦜 Барномаи нави омӯзишӣ барои Тоҷикистон
              </div>
            </FadeUp>

            <FadeUp delay="delay-100">
              <h1 className="text-[32px] md:text-[48px] font-black leading-tight mb-5 text-text-dark">
                Русӣ ва Англисӣ
                <br />
                <span className="gradient-text">бо завқ омӯзед!</span>
              </h1>
            </FadeUp>

            <FadeUp delay="delay-200">
              <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-md">
                Tuti — барномаи ройгон барои омӯхтани забонҳои русӣ ва англисӣ.
                Дарсҳои кӯтоҳ, бозиҳои шавқовар ва натиҷаи воқеӣ.
              </p>
            </FadeUp>

            <FadeUp delay="delay-300">
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => scrollTo("#about")}
                  className="gradient-teal text-white font-bold px-7 py-3.5 rounded-2xl text-base animate-pulse-glow hover:opacity-90 transition-opacity cursor-pointer"
                >
                  📱 Боргирӣ кунед
                </button>
                <button
                  onClick={() => scrollTo("#features")}
                  className="border-2 border-primary text-primary font-bold px-7 py-3.5 rounded-2xl text-base hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  Бештар бидонед ↓
                </button>
              </div>
            </FadeUp>

            <FadeUp delay="delay-400">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    { letter: "А", bg: "bg-primary" },
                    { letter: "Б", bg: "bg-accent-cyan" },
                    { letter: "В", bg: "bg-accent-yellow" },
                    { letter: "Г", bg: "bg-accent-green" },
                  ].map((u) => (
                    <div
                      key={u.letter}
                      className={`w-8 h-8 rounded-full ${u.bg} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
                    >
                      {u.letter}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-text-muted font-medium">
                  <strong className="text-text-dark">500+</strong> нафар аллакай
                  истифода мебаранд
                </span>
              </div>
            </FadeUp>
          </div>

          {/* Right column — Phone */}
          <div className="flex-shrink-0">
            <FadeUp delay="delay-200">
              <PhoneMockup />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-text-dark mb-3">
              Чаро Tuti? 🦜
            </h2>
          </FadeUp>
          <FadeUp delay="delay-100">
            <p className="text-center text-text-muted text-lg mb-12 max-w-lg mx-auto">
              Мо забономӯзиро осон ва шавқовар кардем
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                emoji: "🎮",
                title: "Бозиҳои шавқовар",
                desc: "Дарсҳо ба монанди бозӣ — ҳар рӯз 5 дақиқа кифоя аст",
              },
              {
                emoji: "🇹🇯",
                title: "Барои тоҷикон",
                desc: "Тарҷума ва шарҳ бо забони тоҷикӣ — забони модарии шумо",
              },
              {
                emoji: "📴",
                title: "Бе интернет",
                desc: "Дарсҳоро боргирӣ кунед ва бе интернет омӯзед",
              },
              {
                emoji: "📈",
                title: "Натиҷаи воқеӣ",
                desc: "Системаи такрори интервалӣ — калимаҳо дар хотир мемонанд",
              },
            ].map((f, i) => (
              <FadeUp
                key={f.title}
                delay={
                  i === 0
                    ? ""
                    : i === 1
                      ? "delay-100"
                      : i === 2
                        ? "delay-200"
                        : "delay-300"
                }
              >
                <div className="bg-white rounded-[20px] border border-border-light p-7 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{f.emoji}</div>
                  <h3 className="text-lg font-bold text-text-dark mb-2">
                    {f.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-20 px-5">
        <div className="max-w-[700px] mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-text-dark mb-3">
              Чӣ тавр кор мекунад?
            </h2>
          </FadeUp>
          <FadeUp delay="delay-100">
            <p className="text-center text-text-muted text-lg mb-14">
              Дар 3 қадам оғоз кунед
            </p>
          </FadeUp>

          <div className="space-y-10">
            {[
              {
                num: 1,
                title: "Боргирӣ кунед",
                desc: "Tuti-ро аз Google Play ройгон боргирӣ кунед ва насб кунед",
              },
              {
                num: 2,
                title: "Забонро интихоб кунед",
                desc: "Русӣ ё Англисӣ — ё ҳар ду! Сатҳи худро муайян кунед",
              },
              {
                num: 3,
                title: "Ҳар рӯз омӯзед",
                desc: "5 дақиқа дар рӯз кифоя аст. Tuti ба шумо ёдоварӣ мекунад 🦜",
              },
            ].map((step, i) => (
              <FadeUp
                key={step.num}
                delay={
                  i === 0 ? "" : i === 1 ? "delay-100" : "delay-200"
                }
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full gradient-teal flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-dark mb-1">
                      {step.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section id="about" className="py-20 px-5">
        <div className="max-w-3xl mx-auto relative overflow-hidden rounded-[28px] gradient-teal px-6 py-16 md:px-16 text-center">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute top-[40%] left-[10%] w-16 h-16 rounded-full bg-white/5" />

          <FadeUp>
            <div className="relative z-10">
              <div className="mx-auto mb-6 w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center">
                <TutiMascot size={52} />
              </div>
              <h2 className="text-2xl md:text-[32px] font-extrabold text-white mb-4 leading-tight">
                Аввалин шавед, ки Tuti-ро
                <br />
                истифода баред!
              </h2>
              <p className="text-white/85 text-base md:text-lg mb-8 max-w-md mx-auto">
                Email-и худро гузоред ва мо ба шумо хабар медиҳем вақте ки Tuti
                тайёр мешавад
              </p>

              {!emailSubmitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email-и шумо..."
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl text-text-dark font-medium placeholder:text-text-muted/60 outline-none focus:ring-2 focus:ring-accent-yellow"
                  />
                  <button
                    type="submit"
                    className="bg-accent-yellow text-text-dark font-bold px-6 py-3.5 rounded-xl hover:brightness-105 transition-all whitespace-nowrap cursor-pointer"
                  >
                    Ман мехоҳам! 🦜
                  </button>
                </form>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 inline-block">
                  <span className="text-white text-lg font-bold">
                    ✅ Ташаккур! Мо ба шумо хабар медиҳем!
                  </span>
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border-light py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TutiMascot size={28} />
            <span className="font-bold text-text-dark">Tuti</span>
            <span className="text-text-muted text-sm">© 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://t.me/tutitj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors font-semibold text-sm"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/tutitj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors font-semibold text-sm"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@tutitj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors font-semibold text-sm"
            >
              YouTube
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
