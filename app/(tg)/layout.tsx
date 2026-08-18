import type { Metadata } from "next";
import "../globals.css";

import { nunito } from "@/app/fonts";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
      <head />
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
