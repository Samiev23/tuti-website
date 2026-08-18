import { Nunito } from "next/font/google";

// Один инстанс шрифта на оба root layout — (tg) и (ru).
export const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
});
