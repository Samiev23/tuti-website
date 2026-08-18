import type { Metadata } from "next";
import "../globals.css";

import { nunito } from "@/app/fonts";

// Отдельный root layout для русскоязычных правовых страниц:
// атрибут <html lang> задаётся только в root layout, поэтому /privacy
// живёт в своей route group и объявляет lang="ru".
export const metadata: Metadata = {
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

export default function RuRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head />
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
