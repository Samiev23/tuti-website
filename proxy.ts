import { NextResponse, type NextRequest } from "next/server";

/**
 * Разводит два сайта по одному деплою:
 *   tutitj.com        → публичный лендинг (app/page.tsx)
 *   admin.tutitj.com  → админка (сегмент app/admin)
 *
 * Это только маршрутизация, а не защита: доступ к данным закрывают
 * Firebase-токен с claim `admin` в /api/admin/* и Firestore Security Rules.
 */

const ADMIN_HOST_PREFIX = "admin.";

function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

export default function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = req.nextUrl;

  if (host.startsWith(ADMIN_HOST_PREFIX)) {
    if (pathname.startsWith("/admin")) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // На публичном домене админки не существует — чтобы её не находили перебором.
  // Локально (localhost:3000/admin) оставляем доступной для разработки.
  if (pathname.startsWith("/admin") && !isLocalHost(host)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|.*\\.[\\w]+$).*)"],
};
