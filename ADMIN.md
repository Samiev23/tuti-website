# Tuti Admin Panel

Закрытая панель управления Tuti. Живёт в том же Next.js-проекте, что и публичный
сайт, но отдаётся на отдельном домене:

| Домен              | Что отдаётся                       |
| ------------------ | ---------------------------------- |
| `tutitj.com`       | публичный лендинг (`app/page.tsx`) |
| `admin.tutitj.com` | админка (`app/admin/*`)            |

Разводит домены [`proxy.ts`](proxy.ts): на хосте `admin.*` пути переписываются в
сегмент `/admin`, а на публичном домене `/admin` отдаёт 404. Локально админка
доступна по `http://localhost:3000/admin`.

## Стек

Тот же, что у сайта: Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript.
Добавлены только `firebase` (вход администратора) и `firebase-admin` (серверные
операции). Новых фреймворков нет.

## Разделы

- **Dashboard** — метрики из Firestore проекта `tuti-tj`.
- **Promo Codes** — управление коллекцией `TUTI-PROMOCODES` (та же, что читает
  Android-приложение: ID документа = сам код).
- Users, Analytics, Courses, Tuti Plus, Settings — пункты меню помечены `Soon`.

## Настройка

1. **Web App в Firebase.** Firebase Console → проект `tuti-tj` → Project settings →
   Your apps → Add app → Web (`</>`). Скопируйте `apiKey` и `appId`.
2. **Ключ сервис-аккаунта.** Project settings → Service accounts → Generate new
   private key. Скачается JSON.
3. **Метод входа.** Authentication → Sign-in method → включите Email/Password.
4. `cp .env.example .env.local` и заполните значения. `FIREBASE_SERVICE_ACCOUNT_KEY` —
   весь JSON одной строкой либо он же в base64.

```bash
npm install
npm run dev
```

Админка: <http://localhost:3000/admin>

## Первый администратор

1. Firebase Console → Authentication → Users → Add user (почта + пароль).
2. Выдайте права (custom claim `admin: true`):

```bash
npm run set-admin -- admin@tutitj.com
```

Снять права:

```bash
npm run set-admin -- admin@tutitj.com --revoke
```

Скрипт также отзывает refresh-токены, поэтому изменение прав применяется сразу.
Обычный пользователь Tuti без этого claim войти в панель не сможет: он увидит
экран «нет прав администратора», а API вернёт 403.

## Как устроена защита

1. **Клиент** входит через Firebase Authentication и получает ID-токен.
2. **API-роуты** `/api/admin/*` вызывают `requireAdmin()`: проверяют подпись
   токена через Admin SDK (с `checkRevoked`) и наличие claim `admin: true`.
   Без этого ни один запрос к данным не выполняется.
3. **Firestore Security Rules** независимо запрещают клиенту создавать, удалять
   промокоды и менять `active` / `months` / `used` — даже в обход панели.

Скрытый адрес `admin.tutitj.com` защитой не считается и ни на что не влияет.

## Деплой

Один деплой на два домена: в проекте (Vercel или другой хостинг) добавьте оба
домена — `tutitj.com` и `admin.tutitj.com` — и пропишите переменные из
`.env.example` в настройках окружения. Разводит их `proxy.ts` по заголовку `Host`.
