/**
 * Единственная дверь в админские API: проверяем Firebase ID-токен и claim
 * `admin: true`. Скрытый адрес admin.tutitj.com сам по себе ничего не защищает,
 * поэтому каждый роут обязан вызвать requireAdmin() до любой работы с данными.
 */
import { adminAuth, isAdminSdkConfigured } from "@/lib/firebase/admin";

export const ADMIN_CLAIM = "admin";

export type AdminIdentity = {
  uid: string;
  email: string | null;
};

export class AdminAuthError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

export async function requireAdmin(req: Request): Promise<AdminIdentity> {
  // Токен проверяем первым: анонимный запрос не должен даже узнать,
  // настроен сервер или нет.
  const token = bearerToken(req);
  if (!token) throw new AdminAuthError(401, "Нет токена авторизации");

  if (!isAdminSdkConfigured()) {
    throw new AdminAuthError(503, "Серверный Firebase не настроен (FIREBASE_SERVICE_ACCOUNT_KEY)");
  }

  let decoded;
  try {
    // checkRevoked: выход администратора или отзыв сессии сразу закрывает доступ.
    decoded = await adminAuth().verifyIdToken(token, true);
  } catch {
    throw new AdminAuthError(401, "Токен недействителен или истёк");
  }

  if (decoded[ADMIN_CLAIM] !== true) {
    throw new AdminAuthError(403, "Доступ запрещён: у аккаунта нет прав администратора");
  }

  return { uid: decoded.uid, email: decoded.email ?? null };
}

/** Аккуратный JSON-ответ на ошибку, чтобы роуты не дублировали try/catch. */
export function errorResponse(error: unknown): Response {
  if (error instanceof AdminAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Неизвестная ошибка";
  console.error("[admin-api]", error);
  return Response.json({ error: message }, { status: 500 });
}
