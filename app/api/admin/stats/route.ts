import { NextRequest } from "next/server";

import { errorResponse, requireAdmin } from "@/lib/admin/auth";
import { PROMO_COLLECTION } from "@/lib/admin/promoCodes";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_WINDOW_DAYS = 7;

/** Сколько профилей максимум читаем ради подсчёта уроков — защита от счёта Firestore. */
const LESSONS_SCAN_LIMIT = 2000;
const GET_ALL_CHUNK = 300;

/**
 * Пройденные уроки нигде не агрегированы: они лежат картой внутри
 * users/{uid}/sync/lessons. Считать можно только чтением документов, поэтому
 * запускается это не при каждом открытии дашборда, а по кнопке.
 */
async function countLessonsCompleted() {
  const db = adminDb();
  const userRefs = await db.collection("users").listDocuments();
  const scanned = userRefs.slice(0, LESSONS_SCAN_LIMIT);

  let lessonsCompleted = 0;
  for (let i = 0; i < scanned.length; i += GET_ALL_CHUNK) {
    const chunk = scanned.slice(i, i + GET_ALL_CHUNK).map((ref) => ref.collection("sync").doc("lessons"));
    const docs = await db.getAll(...chunk);
    for (const doc of docs) {
      const data = doc.data();
      if (!data) continue;
      for (const value of Object.values(data)) {
        if (value && typeof value === "object" && (value as { completed?: unknown }).completed === true) {
          lessonsCompleted += 1;
        }
      }
    }
  }

  return {
    lessonsCompleted,
    usersScanned: scanned.length,
    truncated: userRefs.length > scanned.length,
  };
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const db = adminDb();
    const includeLessons = req.nextUrl.searchParams.get("include") === "lessons";

    const activeSince = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, plusUsers, promoTotal, promoUsed, promoActive] =
      await Promise.all([
        db.collection("users").count().get(),
        db.collection("users").where("lastActive", ">=", activeSince).count().get(),
        db.collection("users").where("isPlusUser", "==", true).count().get(),
        db.collection(PROMO_COLLECTION).count().get(),
        db.collection(PROMO_COLLECTION).where("used", "==", true).count().get(),
        db.collection(PROMO_COLLECTION).where("active", "==", true).count().get(),
      ]);

    const lessons = includeLessons ? await countLessonsCompleted() : null;

    return Response.json({
      generatedAt: new Date().toISOString(),
      activeWindowDays: ACTIVE_WINDOW_DAYS,
      users: {
        total: totalUsers.data().count,
        active: activeUsers.data().count,
        // isPlusUser в users/{uid} приложение выставляет в true и никогда не
        // снимает при истечении подписки — это «когда-либо активировал Plus».
        plusEverActivated: plusUsers.data().count,
      },
      promoCodes: {
        total: promoTotal.data().count,
        used: promoUsed.data().count,
        active: promoActive.data().count,
      },
      lessons,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
