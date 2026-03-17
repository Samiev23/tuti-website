import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tuti — Омӯзиши забонҳои русӣ ва англисӣ",
  description:
    "Tuti — барномаи ройгон барои омӯхтани забонҳои русӣ ва англисӣ дар Тоҷикистон. Дарсҳои кӯтоҳ, бозиҳои шавқовар ва натиҷаи воқеӣ.",
  keywords: [
    "Tuti",
    "забономӯзӣ",
    "русӣ",
    "англисӣ",
    "Тоҷикистон",
    "language learning",
    "Tajikistan",
  ],
  openGraph: {
    title: "Tuti — Омӯзиши забонҳои русӣ ва англисӣ",
    description:
      "Барномаи ройгон барои омӯхтани забонҳои русӣ ва англисӣ дар Тоҷикистон. Дарсҳои кӯтоҳ, бозиҳои шавқовар ва натиҷаи воқеӣ.",
    url: "https://tutitj.com",
    siteName: "Tuti",
    locale: "tg_TJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuti — Омӯзиши забонҳои русӣ ва англисӣ",
    description:
      "Барномаи ройгон барои омӯхтани забонҳои русӣ ва англисӣ дар Тоҷикистон.",
  },
  metadataBase: new URL("https://tutitj.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tg" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2300BFA6'/><text y='68' x='50' text-anchor='middle' font-size='60'>🦜</text></svg>"
        />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
