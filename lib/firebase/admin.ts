/**
 * Firebase Admin SDK (только сервер). Обходит Security Rules, поэтому любой
 * вызов обязан быть прикрыт requireAdmin() из lib/admin/auth.ts.
 */
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const APP_NAME = "tuti-admin";

type ServiceAccount = {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
};

/**
 * Ключ кладём одной переменной FIREBASE_SERVICE_ACCOUNT_KEY: это либо сырой
 * JSON сервис-аккаунта, либо тот же JSON в base64 (удобно для Vercel, где
 * переносы строк в private_key ломают обычную вставку).
 */
function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;

  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  try {
    return JSON.parse(json) as ServiceAccount;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY: не удалось разобрать JSON сервис-аккаунта");
  }
}

let cachedApp: App | null = null;

function adminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().some((a) => a.name === APP_NAME)) {
    cachedApp = getApp(APP_NAME);
    return cachedApp;
  }

  const sa = readServiceAccount();
  if (!sa) {
    throw new Error(
      "Firebase Admin SDK не настроен: добавьте FIREBASE_SERVICE_ACCOUNT_KEY в окружение",
    );
  }

  const projectId = sa.project_id ?? sa.projectId;
  const clientEmail = sa.client_email ?? sa.clientEmail;
  // В .env перевод строки хранится как \n — возвращаем его обратно.
  const privateKey = (sa.private_key ?? sa.privateKey ?? "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY: нет project_id / client_email / private_key");
  }

  cachedApp = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, APP_NAME);
  return cachedApp;
}

export function isAdminSdkConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim());
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}
