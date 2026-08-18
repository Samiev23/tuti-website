/**
 * Промокоды Tuti Plus. Коллекция та же, что читает Android-приложение:
 * TUTI-PROMOCODES, где ID документа и есть сам код (см. PromoCodeManager.kt).
 * Поля не переименовываем — приложение уже умеет active / used / months.
 */
import { FieldValue, type Firestore } from "firebase-admin/firestore";

export const PROMO_COLLECTION = "TUTI-PROMOCODES";

export const CODE_PREFIX = "TUTI-";

/** Без 0/O/1/I/L — коды диктуют по телефону и переписывают от руки. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

const RANDOM_PART_LENGTH = 5;

export const MAX_BATCH_SIZE = 100;

export type PromoCode = {
  code: string;
  active: boolean;
  used: boolean;
  months: number;
  type: string;
  usedBy: string | null;
  usedAt: string | null;
  createdAt: string | null;
  createdBy: string | null;
};

function randomCode(): string {
  const bytes = new Uint8Array(RANDOM_PART_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return CODE_PREFIX + out;
}

/** Числа в консоли Firestore часто заводят строкой — читаем терпимо к типу. */
function readNumber(raw: unknown, fallback: number): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const parsed = Number.parseInt(raw.trim(), 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readDate(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null && "toDate" in raw) {
    const date = (raw as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof raw === "number") return new Date(raw).toISOString();
  if (typeof raw === "string") {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}

export function mapPromoCode(id: string, data: Record<string, unknown> | undefined): PromoCode {
  const d = data ?? {};
  return {
    code: id,
    // Поля active может не быть у старых документов — приложение считает такой код активным.
    active: typeof d.active === "boolean" ? d.active : true,
    used: d.used === true,
    months: readNumber(d.months, Math.max(1, Math.round(readNumber(d.durationDays, 30) / 30))),
    type: typeof d.type === "string" ? d.type : "monthly",
    usedBy: typeof d.usedBy === "string" ? d.usedBy : null,
    usedAt: readDate(d.usedAt),
    createdAt: readDate(d.createdAt),
    createdBy: typeof d.createdBy === "string" ? d.createdBy : null,
  };
}

export function normalizeCode(input: string): string {
  const trimmed = input.trim().toUpperCase().replace(/\s+/g, "");
  return trimmed.startsWith(CODE_PREFIX) ? trimmed : CODE_PREFIX + trimmed;
}

export function isValidCode(code: string): boolean {
  return /^TUTI-[A-Z0-9-]{3,24}$/.test(code);
}

export type CreateOptions = {
  months: number;
  count: number;
  createdBy: string;
  /** Явный код вместо случайного — для ручного создания одной штуки. */
  explicitCode?: string;
};

/**
 * create() падает, если документ уже существует, — это и есть защита от
 * дублей: повторяем со свежим кодом, пока не запишем нужное количество.
 */
export async function createPromoCodes(
  db: Firestore,
  { months, count, createdBy, explicitCode }: CreateOptions,
): Promise<{ created: PromoCode[]; collisions: number }> {
  const created: PromoCode[] = [];
  let collisions = 0;
  const maxAttempts = count * 10 + 10;
  let attempts = 0;

  while (created.length < count && attempts < maxAttempts) {
    attempts += 1;
    const code = explicitCode ?? randomCode();
    const payload = {
      active: true,
      used: false,
      months,
      type: "monthly",
      createdAt: FieldValue.serverTimestamp(),
      createdBy,
    };

    try {
      await db.collection(PROMO_COLLECTION).doc(code).create(payload);
    } catch (error) {
      const code6 = (error as { code?: number | string }).code;
      // ALREADY_EXISTS: код занят. Для ручного ввода это ошибка пользователя,
      // для генерации — просто берём следующий случайный.
      if (code6 === 6 || code6 === "already-exists") {
        collisions += 1;
        if (explicitCode) throw new Error(`Промокод ${explicitCode} уже существует`);
        continue;
      }
      throw error;
    }

    created.push({
      code,
      active: true,
      used: false,
      months,
      type: "monthly",
      usedBy: null,
      usedAt: null,
      createdAt: new Date().toISOString(),
      createdBy,
    });
  }

  if (created.length < count) {
    throw new Error(
      `Удалось создать только ${created.length} из ${count} кодов — слишком много совпадений`,
    );
  }

  return { created, collisions };
}
