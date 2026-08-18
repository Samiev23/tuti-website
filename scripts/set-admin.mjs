#!/usr/bin/env node
/**
 * Выдаёт (или снимает) права администратора Tuti Admin.
 *
 *   node scripts/set-admin.mjs admin@tutitj.com
 *   node scripts/set-admin.mjs admin@tutitj.com --revoke
 *
 * Права — это custom claim `admin: true` в Firebase Auth. Его проверяют и
 * API-роуты панели, и Firestore Security Rules. Выдать claim из браузера
 * нельзя — только этим скриптом с ключом сервис-аккаунта.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/** Мини-парсер .env.local: dotenv в зависимостях проекта нет. */
function loadEnvFile(file) {
  let raw;
  try {
    raw = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key]) continue;
    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(".env.local");

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"));
const revoke = args.includes("--revoke");

if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email> [--revoke]");
  process.exit(1);
}

const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
if (!rawKey) {
  console.error("Нет FIREBASE_SERVICE_ACCOUNT_KEY — положите ключ сервис-аккаунта в .env.local");
  process.exit(1);
}

const serviceAccount = JSON.parse(
  rawKey.startsWith("{") ? rawKey : Buffer.from(rawKey, "base64").toString("utf8"),
);

initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth();
const user = await auth.getUserByEmail(email).catch(() => null);

if (!user) {
  console.error(
    `Пользователь ${email} не найден. Создайте его в Firebase Console → Authentication → Users.`,
  );
  process.exit(1);
}

const claims = { ...(user.customClaims ?? {}) };
if (revoke) delete claims.admin;
else claims.admin = true;

await auth.setCustomUserClaims(user.uid, claims);
// Старый ID-токен живёт до часа — обрываем сессии, чтобы права применились сразу.
await auth.revokeRefreshTokens(user.uid);

console.log(
  revoke
    ? `Права администратора сняты с ${email} (${user.uid})`
    : `${email} (${user.uid}) — теперь администратор. Войдите в панель заново.`,
);
