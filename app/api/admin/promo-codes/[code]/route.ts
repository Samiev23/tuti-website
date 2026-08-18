import { NextRequest } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/admin/auth";
import { PROMO_COLLECTION, mapPromoCode, normalizeCode } from "@/lib/admin/promoCodes";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

/** PATCH — включить/выключить код или изменить срок. Флаг used не трогаем: */
/** его выставляет приложение при активации, и переписывать историю нельзя. */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
    const code = normalizeCode(decodeURIComponent((await params).code));
    const body = (await req.json().catch(() => ({}))) as { active?: unknown; months?: unknown };

    const update: Record<string, unknown> = {};

    if (body.active !== undefined) {
      if (typeof body.active !== "boolean") {
        return Response.json({ error: "active должен быть boolean" }, { status: 400 });
      }
      update.active = body.active;
    }

    if (body.months !== undefined) {
      const months = Number(body.months);
      if (!Number.isInteger(months) || months < 1 || months > 60) {
        return Response.json({ error: "months должен быть от 1 до 60" }, { status: 400 });
      }
      update.months = months;
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Нечего обновлять" }, { status: 400 });
    }

    const ref = adminDb().collection(PROMO_COLLECTION).doc(code);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return Response.json({ error: `Промокод ${code} не найден` }, { status: 404 });
    }

    await ref.update(update);
    const updated = await ref.get();
    return Response.json({ code: mapPromoCode(updated.id, updated.data()) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** DELETE — удаление без возврата; подтверждение спрашивает интерфейс. */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
    const code = normalizeCode(decodeURIComponent((await params).code));

    const ref = adminDb().collection(PROMO_COLLECTION).doc(code);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return Response.json({ error: `Промокод ${code} не найден` }, { status: 404 });
    }

    await ref.delete();
    return Response.json({ deleted: code });
  } catch (error) {
    return errorResponse(error);
  }
}
