/**
 * Firebase Web SDK — используется ТОЛЬКО в админке и только для входа.
 * Данные админка читает и пишет через /api/admin/*, где токен проверяется
 * Admin SDK. Здесь нужен лишь Auth, поэтому Firestore-клиент не поднимаем.
 */
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from "firebase/auth";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/** Без ключей сборка не должна падать — админка сама покажет, чего не хватает. */
export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase Web SDK не настроен: заполните NEXT_PUBLIC_FIREBASE_* в .env.local",
    );
  }
  if (!authInstance) {
    const app = getApps().length ? getApp() : initializeApp(config);
    authInstance = getAuth(app);
    // Сессия переживает перезагрузку вкладки, но не выходит за пределы браузера.
    void setPersistence(authInstance, browserLocalPersistence);
  }
  return authInstance;
}
