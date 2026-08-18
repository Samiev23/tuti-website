import { NextRequest } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/admin/auth";
import {
  MAX_BATCH_SIZE,
  PROMO_COLLECTION,
  createPromoCodes,
  isValidCode,
  mapPromoCode,
  normalizeCode,
} from "@/lib/admin/promoCodes";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/promo-codes — весь список; фильтры и поиск делает клиент. */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const snapshot = await adminDb().collection(PROMO_COLLECTION).get();
    const codes = snapshot.docs
      .map((doc) => mapPromoCode(doc.id, doc.data()))
      .sort((a, b) => {
        // Свежие сверху; у старых кодов createdAt нет — они уходят вниз по алфавиту.
        if (a.createdAt && b.createdAt) return b.createdAt.localeCompare(a.createdAt);
        if (a.createdAt) return -1;
        if (b.createdAt) return 1;
        return a.code.localeCompare(b.code);
      });

    return Response.json({ codes, total: codes.length });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/admin/promo-codes
 * { months, count }        — сгенерировать count уникальных кодов
 * { months, code: "..." }  — создать один код с заданным именем
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = (await req.json().catch(() => ({}))) as {
      months?: unknown;
      count?: unknown;
      code?: unknown;
    };

    const months = Number(body.months ?? 1);
    if (!Number.isInteger(months) || months < 1 || months > 60) {
      return Response.json({ error: "months должен быть целым числом от 1 до 60" }, { status: 400 });
    }

    const explicitCode =
      typeof body.code === "string" && body.code.trim() ? normalizeCode(body.code) : undefined;

    if (explicitCode && !isValidCode(explicitCode)) {
      return Response.json(
        { error: "Код должен быть вида TUTI-XXXXX (латиница и цифры)" },
        { status: 400 },
      );
    }

    const count = explicitCode ? 1 : Number(body.count ?? 1);
    if (!Number.isInteger(count) || count < 1 || count > MAX_BATCH_SIZE) {
      return Response.json(
        { error: `count должен быть целым числом от 1 до ${MAX_BATCH_SIZE}` },
        { status: 400 },
      );
    }

    const { created } = await createPromoCodes(adminDb(), {
      months,
      count,
      createdBy: admin.email ?? admin.uid,
      explicitCode,
    });

    return Response.json({ created }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
