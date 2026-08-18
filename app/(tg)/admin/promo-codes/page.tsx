"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminAuth } from "../_components/AdminAuth";
import { PageHeader } from "../_components/AdminShell";
import { Badge, Button, Card, Field, Input, Modal, Notice, Spinner } from "../_components/ui";

type PromoCode = {
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

type Filter = "all" | "active" | "inactive" | "used" | "unused";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "unused", label: "Unused" },
  { id: "used", label: "Used" },
];

const MONTH_OPTIONS = [1, 3, 6, 12];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PromoCodesPage() {
  const { api } = useAdminAuth();

  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyCode, setBusyCode] = useState<string | null>(null);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ codes: PromoCode[] }>("/api/admin/promo-codes");
      setCodes(data.codes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить промокоды");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toUpperCase();
    return codes.filter((c) => {
      if (q && !c.code.includes(q)) return false;
      if (filter === "active") return c.active;
      if (filter === "inactive") return !c.active;
      if (filter === "used") return c.used;
      if (filter === "unused") return !c.used;
      return true;
    });
  }, [codes, query, filter]);

  async function toggleActive(code: PromoCode) {
    setBusyCode(code.code);
    setError(null);
    try {
      const res = await api<{ code: PromoCode }>(
        `/api/admin/promo-codes/${encodeURIComponent(code.code)}`,
        { method: "PATCH", body: JSON.stringify({ active: !code.active }) },
      );
      setCodes((prev) => prev.map((c) => (c.code === res.code.code ? res.code : c)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось изменить статус");
    } finally {
      setBusyCode(null);
    }
  }

  async function remove(code: PromoCode) {
    setBusyCode(code.code);
    setError(null);
    try {
      await api(`/api/admin/promo-codes/${encodeURIComponent(code.code)}`, { method: "DELETE" });
      setCodes((prev) => prev.filter((c) => c.code !== code.code));
      setNotice(`Промокод ${code.code} удалён`);
      setDeleteTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось удалить промокод");
    } finally {
      setBusyCode(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Promo Codes"
        subtitle="Коллекция TUTI-PROMOCODES — те же коды, что активирует приложение"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => void load()} loading={loading}>
              Обновить
            </Button>
            <Button onClick={() => setGenerateOpen(true)}>Generate Promo Codes</Button>
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {notice && (
        <div className="mb-4">
          <Notice tone="success">{notice}</Notice>
        </div>
      )}

      {lastGenerated.length > 0 && (
        <Card className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-text-dark">
                Создано кодов: {lastGenerated.length}
              </h2>
              <p className="mt-2 font-mono text-sm font-bold leading-relaxed text-primary-dark">
                {lastGenerated.join("  ·  ")}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={() => void navigator.clipboard.writeText(lastGenerated.join("\n"))}
              >
                Копировать
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                onClick={() => setLastGenerated([])}
              >
                Скрыть
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[220px] flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по коду: TUTI-…"
            />
          </div>
          <div className="flex flex-wrap gap-1 rounded-xl bg-bg-mint p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  filter === f.id
                    ? "bg-white text-primary-dark shadow-sm"
                    : "text-text-muted hover:text-text-dark"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-text-muted">
            {visible.length} из {codes.length}
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-light text-[11px] uppercase tracking-wide text-text-muted">
              <th className="px-5 py-3 font-bold">Код</th>
              <th className="px-5 py-3 font-bold">Месяцев</th>
              <th className="px-5 py-3 font-bold">Active</th>
              <th className="px-5 py-3 font-bold">Used</th>
              <th className="px-5 py-3 font-bold">Создан</th>
              <th className="px-5 py-3 text-right font-bold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-text-muted">
                  <Spinner className="text-primary" />
                </td>
              </tr>
            )}

            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm font-semibold text-text-muted">
                  {codes.length === 0
                    ? "Промокодов пока нет — создайте первый через Generate Promo Codes"
                    : "Ничего не найдено по текущему фильтру"}
                </td>
              </tr>
            )}

            {!loading &&
              visible.map((code) => (
                <tr key={code.code} className="border-b border-border-light/70 last:border-0">
                  <td className="px-5 py-3">
                    <button
                      onClick={() => void navigator.clipboard.writeText(code.code)}
                      title="Скопировать код"
                      className="font-mono text-sm font-extrabold text-text-dark transition hover:text-primary"
                    >
                      {code.code}
                    </button>
                  </td>
                  <td className="px-5 py-3 font-bold text-text-dark">{code.months}</td>
                  <td className="px-5 py-3">
                    {code.active ? (
                      <Badge tone="success">Active</Badge>
                    ) : (
                      <Badge tone="neutral">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {code.used ? (
                      <Badge tone="warning">Used {formatDate(code.usedAt)}</Badge>
                    ) : (
                      <Badge tone="neutral">Unused</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-text-muted">
                    {formatDate(code.createdAt)}
                    {code.createdBy && <div className="truncate">{code.createdBy}</div>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="px-3 py-1.5 text-xs"
                        loading={busyCode === code.code}
                        onClick={() => void toggleActive(code)}
                      >
                        {code.active ? "Деактивировать" : "Активировать"}
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-3 py-1.5 text-xs hover:text-red-600"
                        onClick={() => setDeleteTarget(code)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>

      {generateOpen && (
        <GenerateModal
          onClose={() => setGenerateOpen(false)}
          onCreated={(created) => {
            setCodes((prev) => [...created, ...prev]);
            setLastGenerated(created.map((c) => c.code));
            setGenerateOpen(false);
            setNotice(null);
          }}
        />
      )}

      {deleteTarget && (
        <Modal title="Удалить промокод?" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm font-semibold text-text-muted">
            Код <span className="font-mono font-extrabold text-text-dark">{deleteTarget.code}</span>{" "}
            будет удалён из Firestore без возможности восстановления.
            {deleteTarget.used && " Он уже использован — история активации тоже пропадёт."}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Отмена
            </Button>
            <Button
              variant="danger"
              loading={busyCode === deleteTarget.code}
              onClick={() => void remove(deleteTarget)}
            >
              Удалить
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ─── Модалка создания ─── */
function GenerateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (codes: PromoCode[]) => void;
}) {
  const { api } = useAdminAuth();
  const [months, setMonths] = useState(1);
  const [count, setCount] = useState(5);
  const [customCode, setCustomCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const body = customCode.trim()
        ? { months, code: customCode.trim() }
        : { months, count };
      const res = await api<{ created: PromoCode[] }>("/api/admin/promo-codes", {
        method: "POST",
        body: JSON.stringify(body),
      });
      onCreated(res.created);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать промокоды");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Generate Promo Codes" onClose={onClose}>
      <Field label="Срок подписки">
        <div className="flex gap-2">
          {MONTH_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                months === m
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-border-light text-text-muted hover:border-primary/40"
              }`}
            >
              {m} мес
            </button>
          ))}
        </div>
      </Field>

      <Field label="Количество" hint="До 100 кодов за раз. Уникальность проверяет Firestore.">
        <Input
          type="number"
          min={1}
          max={100}
          value={count}
          disabled={Boolean(customCode.trim())}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </Field>

      <Field
        label="Свой код (необязательно)"
        hint="Если заполнить — создастся ровно один код с этим именем."
      >
        <Input
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
          placeholder="TUTI-VIP01"
        />
      </Field>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button loading={busy} onClick={() => void submit()}>
          Создать
        </Button>
      </div>
    </Modal>
  );
}
