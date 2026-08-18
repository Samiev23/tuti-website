"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminAuth } from "./_components/AdminAuth";
import { PageHeader } from "./_components/AdminShell";
import { Button, Card, Notice, StatCard } from "./_components/ui";

type Stats = {
  generatedAt: string;
  activeWindowDays: number;
  users: { total: number; active: number; plusEverActivated: number };
  promoCodes: { total: number; used: number; active: number };
  lessons: { lessonsCompleted: number; usersScanned: number; truncated: boolean } | null;
};

export default function DashboardPage() {
  const { api } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const load = useCallback(
    async (withLessons = false) => {
      const setBusy = withLessons ? setLessonsLoading : setLoading;
      setBusy(true);
      setError(null);
      try {
        const data = await api<Stats>(
          `/api/admin/stats${withLessons ? "?include=lessons" : ""}`,
        );
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось загрузить статистику");
      } finally {
        setBusy(false);
      }
    },
    [api],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const updatedAt = stats ? new Date(stats.generatedAt).toLocaleString("ru-RU") : null;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={updatedAt ? `Данные Firestore на ${updatedAt}` : "Загрузка данных Firestore…"}
        action={
          <Button variant="secondary" onClick={() => void load()} loading={loading}>
            Обновить
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.users.total ?? null}
          loading={loading}
          hint="Документов в коллекции users"
        />
        <StatCard
          label="Active Users"
          value={stats?.users.active ?? null}
          loading={loading}
          accent="cyan"
          hint={`Заходили за последние ${stats?.activeWindowDays ?? 7} дней (поле lastActive)`}
        />
        <StatCard
          label="Tuti Plus Users"
          value={stats?.users.plusEverActivated ?? null}
          loading={loading}
          accent="yellow"
          hint="Флаг isPlusUser = true. Приложение не снимает его после окончания подписки — это «когда-либо активировали Plus»"
        />
        <StatCard
          label="Lessons Completed"
          value={stats?.lessons?.lessonsCompleted ?? null}
          loading={lessonsLoading}
          accent="green"
          hint={
            stats?.lessons
              ? `По ${stats.lessons.usersScanned} профилям${stats.lessons.truncated ? " (лимит выборки)" : ""}`
              : "Агрегата нет в базе — считается перебором users/*/sync/lessons"
          }
          action={
            stats?.lessons ? null : (
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                loading={lessonsLoading}
                onClick={() => void load(true)}
              >
                Посчитать
              </Button>
            )
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Промокоды всего"
          value={stats?.promoCodes.total ?? null}
          loading={loading}
        />
        <StatCard
          label="Активных"
          value={stats?.promoCodes.active ?? null}
          loading={loading}
          accent="cyan"
        />
        <StatCard
          label="Использованных"
          value={stats?.promoCodes.used ?? null}
          loading={loading}
          accent="yellow"
        />
      </div>

      <Card className="mt-6">
        <h2 className="text-sm font-extrabold text-text-dark">Чего пока нет в данных</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm font-semibold leading-relaxed text-text-muted">
          <li>
            <strong className="text-text-dark">Активная подписка Plus.</strong> В{" "}
            <code>users/&#123;uid&#125;</code> лежит только флаг <code>isPlusUser</code>, который
            выставляется в true и не снимается. Точный срок хранится в{" "}
            <code>users/&#123;uid&#125;/sync/progress.plusExpiry</code> — для честной метрики нужно
            дублировать <code>plusExpiry</code> в корневой документ пользователя.
          </li>
          <li>
            <strong className="text-text-dark">Пройденные уроки.</strong> Хранятся картой внутри{" "}
            <code>sync/lessons</code> у каждого пользователя, агрегата нет. Считаем по кнопке, чтобы
            не жечь чтения Firestore; для постоянной метрики нужен счётчик{" "}
            <code>lessonsCompleted</code> в профиле.
          </li>
          <li>
            <strong className="text-text-dark">DAU/MAU и удержание.</strong> Появятся вместе с
            Analytics — это отдельный следующий этап.
          </li>
        </ul>
      </Card>
    </>
  );
}
