import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { SiteFooter } from "@/app/_components/SiteFooter";
import { TutiMascot } from "@/app/_components/TutiMascot";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Tuti",
  description:
    "Политика конфиденциальности приложения «Tuti»: какие данные мы собираем, как их используем, кому передаём и как удалить учётную запись.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Политика конфиденциальности — Tuti",
    description:
      "Какие данные собирает приложение «Tuti», как они используются, кому передаются и какие права есть у пользователя.",
    url: "https://tutitj.com/privacy",
    siteName: "Tuti",
    locale: "ru_RU",
    type: "article",
  },
};

/* ─── Строительные блоки документа ─── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-border-light pt-8 mt-8 first:border-0 first:pt-0 first:mt-0"
    >
      <h2 className="text-xl md:text-2xl font-extrabold text-text-dark mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-base md:text-lg font-bold text-text-dark pt-2">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] md:text-base leading-relaxed text-text-dark/80">
      {children}
    </p>
  );
}

function B({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-text-dark">{children}</strong>;
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 marker:text-primary text-[15px] md:text-base leading-relaxed text-text-dark/80">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const linkClass =
  "text-primary font-semibold underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors break-words";

/** Внешняя ссылка — всегда открывается в новой вкладке. */
function Ext({ href, children }: { href: string; children?: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children ?? href}
    </a>
  );
}

function Mail({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className={linkClass}>
      {address}
    </a>
  );
}

const providers = [
  {
    name: "Google Firebase (Firestore, Firebase Authentication)",
    purpose: "хранение данных, аутентификация",
    policy: "https://firebase.google.com/support/privacy",
  },
  {
    name: "Google Play / Google Sign-In",
    purpose: "распространение приложения, вход",
    policy: "https://policies.google.com/privacy",
  },
  {
    name: "OpenAI, L.L.C.",
    purpose: "функция ИИ-репетитора",
    policy: "https://openai.com/policies/privacy-policy",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      {/* ─── ШАПКА ─── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border-light/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <Link href="/" className="flex items-center gap-2">
            <TutiMascot size={36} />
            <span className="text-2xl font-extrabold text-text-dark">Tuti</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* ─── ДОКУМЕНТ ─── */}
      <main className="flex-1 px-5 py-10 md:py-16">
        <article className="max-w-3xl mx-auto bg-white rounded-3xl border border-border-light shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-dark leading-tight">
            Политика конфиденциальности приложения «Tuti»
          </h1>

          <div className="mt-4 mb-8 text-sm md:text-[15px] text-text-muted space-y-1">
            <p>
              <B>Дата вступления в силу:</B> 18 августа 2026 г.
            </p>
            <p>
              <B>Последнее обновление:</B> 20 августа 2026 г.
            </p>
          </div>

          <Section id="obshchie-polozheniya" title="1. Общие положения">
            <P>
              Настоящая Политика конфиденциальности описывает, какие данные
              собирает мобильное приложение «Tuti» (далее — «Приложение»), как
              они используются, кому передаются и какие права есть у
              пользователя.
            </P>
            <P>
              <B>Разработчик (оператор данных):</B> Tuti Team
              <br />
              <B>Местонахождение:</B> г. Душанбе, Республика Таджикистан
              <br />
              <B>Контактный e-mail:</B> <Mail address="tutiapp08@gmail.com" />
            </P>
            <P>
              Устанавливая и используя Приложение, вы подтверждаете, что
              ознакомились с настоящей Политикой и согласны с ней. Если вы не
              согласны — пожалуйста, не используйте Приложение.
            </P>
          </Section>

          <Section id="vozrastnoe-ogranichenie" title="2. Возрастное ограничение">
            <P>
              Приложение предназначено{" "}
              <B>для пользователей, достигших 13 лет</B>.
            </P>
            <P>
              Создавая учётную запись, вы подтверждаете, что вам исполнилось 13
              лет. При первом запуске Приложение запрашивает дату рождения; если
              указанный возраст меньше 13 лет, доступ к Приложению не
              предоставляется.
            </P>
            <P>
              Если вам от 13 до 18 лет, вы можете пользоваться Приложением только
              с согласия родителя или законного представителя.
            </P>
            <P>
              Мы сознательно не собираем данные лиц младше 13 лет. Если нам
              станет известно, что учётная запись создана лицом младше 13 лет, мы
              удалим её и связанные с ней данные.
            </P>
            <P>
              <B>Родителям и законным представителям.</B> Если вы считаете, что
              ваш ребёнок младше 13 лет предоставил нам свои данные, напишите на{" "}
              <Mail address="tutiapp08@gmail.com" /> — мы удалим их в кратчайший
              срок. Вы также вправе запросить сведения о данных вашего ребёнка,
              потребовать их исправления или удаления.
            </P>
          </Section>

          <Section id="kakie-dannye" title="3. Какие данные мы собираем">
            <H3>3.1. Данные учётной записи</H3>
            <P>
              Вход в Приложение выполняется через <B>Google Sign-In</B>. При
              входе мы получаем от Google:
            </P>
            <List
              items={[
                "уникальный идентификатор пользователя (UID);",
                "адрес электронной почты;",
                "отображаемое имя;",
                "ссылку на фотографию профиля (если она есть).",
              ]}
            />
            <P>
              Мы <B>не получаем и не храним</B> ваш пароль от аккаунта Google.
            </P>

            <H3>3.2. Данные, которые вы указываете сами</H3>
            <P>
              При прохождении онбординга и в процессе использования Приложения вы
              указываете:
            </P>
            <List
              items={[
                "изучаемый язык (английский или русский);",
                "уровень владения языком;",
                "цель обучения;",
                "желаемое ежедневное время занятий;",
                "город проживания (выбирается из списка; точная геолокация не используется).",
              ]}
            />

            <H3>3.3. Данные об обучении</H3>
            <List
              items={[
                "пройденные уроки и результаты выполнения заданий;",
                "количество очков опыта (XP);",
                "серия дней подряд (streak);",
                "статистика по практике: карточки, аудирование, письмо, диалоги с ИИ-репетитором;",
                "статус подписки Tuti Plus и срок её действия.",
              ]}
            />

            <H3>3.4. Технические данные</H3>
            <List
              items={[
                "модель устройства и версия операционной системы;",
                "версия Приложения;",
                "язык и региональные настройки устройства;",
                "отчёты о сбоях и ошибках;",
                "дата и время последней активности.",
              ]}
            />

            <H3>3.5. Данные, которые мы НЕ собираем</H3>
            <P>
              Мы не собираем: точную геолокацию (GPS), контакты, фотографии из
              галереи, SMS, историю звонков, данные о состоянии здоровья,
              биометрические данные, а также данные банковских карт.
            </P>
          </Section>

          <Section id="tseli-obrabotki" title="4. Цели обработки данных">
            <P>Мы обрабатываем данные для того, чтобы:</P>
            <List
              items={[
                "создать и поддерживать вашу учётную запись;",
                "сохранять прогресс обучения и синхронизировать его между устройствами;",
                "формировать персональную программу занятий на основе выбранного уровня и целей;",
                "отображать рейтинг пользователей по городам;",
                "предоставлять функции ИИ-репетитора;",
                "активировать и проверять статус подписки Tuti Plus;",
                "выявлять и устранять технические сбои, улучшать работу Приложения;",
                "отвечать на ваши обращения в поддержку.",
              ]}
            />
          </Section>

          <Section id="pravovye-osnovaniya" title="5. Правовые основания">
            <P>Обработка данных осуществляется на основании:</P>
            <List
              items={[
                "вашего согласия, выраженного при регистрации и использовании Приложения;",
                "необходимости исполнения соглашения между вами и нами (предоставление функций Приложения);",
                "нашего законного интереса в обеспечении стабильной и безопасной работы сервиса.",
              ]}
            />
            <P>
              Вы вправе отозвать согласие в любой момент, удалив учётную запись
              (см. раздел 10).
            </P>
          </Section>

          <Section id="publichnye-dannye" title="6. Публичные данные и рейтинг">
            <P>
              В Приложении есть <B>рейтинг пользователей по городам</B>. Другим
              пользователям Приложения видны:
            </P>
            <List
              items={[
                "ваше отображаемое имя;",
                "фотография профиля;",
                "количество очков опыта (XP);",
                "указанный вами город.",
              ]}
            />
            <P>
              Ваш e-mail и другие данные учётной записи{" "}
              <B>никогда не отображаются публично</B>. Если вы не хотите
              участвовать в рейтинге, вы можете изменить отображаемое имя в
              настройках профиля или обратиться к нам по адресу{" "}
              <Mail address="tutiapp08@gmail.com" />.
            </P>
          </Section>

          <Section id="ii-repetitor" title="7. ИИ-репетитор">
            <P>
              Раздел «Практика» включает функцию диалога с ИИ-репетитором. Текст
              ваших сообщений передаётся компании <B>OpenAI, L.L.C.</B> для
              формирования ответа.
            </P>
            <P>
              Пожалуйста,{" "}
              <B>
                не указывайте в диалогах с ИИ-репетитором персональные данные
              </B>
              : номера документов, банковские реквизиты, пароли, домашние адреса,
              сведения о здоровье.
            </P>
            <P>
              Обработка данных на стороне OpenAI регулируется её собственными
              документами:
            </P>
            <List
              items={[
                <>
                  Политика конфиденциальности:{" "}
                  <Ext href="https://openai.com/policies/privacy-policy" />
                </>,
                <>
                  Политика конфиденциальности для API:{" "}
                  <Ext href="https://openai.com/policies/api-data-usage-policies" />
                </>,
                <>
                  Условия использования:{" "}
                  <Ext href="https://openai.com/policies/terms-of-use" />
                </>,
              ]}
            />
            <P>
              Ответы, сформированные искусственным интеллектом, могут содержать
              неточности. Они предоставляются исключительно в учебных целях и не
              являются профессиональной консультацией.
            </P>
          </Section>

          <Section id="peredacha-dannyh" title="8. Передача данных третьим лицам">
            <P>
              Мы <B>не продаём и не передаём</B> ваши данные третьим лицам в
              рекламных целях. Данные передаются только следующим поставщикам
              услуг, необходимым для работы Приложения:
            </P>

            {/* До md — карточки, от md — обычная таблица со скроллом при нехватке ширины */}
            <div className="md:hidden space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.name}
                  className="rounded-2xl border border-border-light bg-bg-mint/60 p-4 space-y-2"
                >
                  <div className="font-bold text-text-dark text-[15px]">
                    {provider.name}
                  </div>
                  <div className="text-sm text-text-dark/80">
                    <span className="text-text-muted">Назначение: </span>
                    {provider.purpose}
                  </div>
                  <div className="text-sm">
                    <span className="text-text-muted">
                      Политика конфиденциальности:{" "}
                    </span>
                    <Ext href={provider.policy} />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-border-light">
              <table className="w-full min-w-[560px] text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-bg-mint">
                    <th className="px-4 py-3 font-bold text-text-dark">
                      Поставщик
                    </th>
                    <th className="px-4 py-3 font-bold text-text-dark">
                      Назначение
                    </th>
                    <th className="px-4 py-3 font-bold text-text-dark">
                      Политика конфиденциальности
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr
                      key={provider.name}
                      className="border-t border-border-light"
                    >
                      <td className="px-4 py-3 align-top text-text-dark/80">
                        {provider.name}
                      </td>
                      <td className="px-4 py-3 align-top text-text-dark/80">
                        {provider.purpose}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <Ext href={provider.policy} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <P>
              Мы также вправе раскрыть данные, если этого требует
              законодательство или запрос уполномоченного государственного
              органа.
            </P>
          </Section>

          <Section id="hranenie-i-zashchita" title="9. Хранение и защита данных">
            <P>
              Данные хранятся на серверах Google Cloud Platform (Firebase) в
              дата-центрах, расположенных за пределами Республики Таджикистан.
              Данные, передаваемые ИИ-репетитору, обрабатываются на серверах
              OpenAI. Используя Приложение, вы соглашаетесь с трансграничной
              передачей данных.
            </P>
            <P>Мы применяем следующие меры защиты:</P>
            <List
              items={[
                "передача данных по защищённому протоколу HTTPS/TLS;",
                "правила безопасности Firestore, ограничивающие доступ к данным только владельцу учётной записи;",
                "отсутствие хранения паролей на нашей стороне.",
              ]}
            />
            <P>
              Обратите внимание: ни один способ передачи данных через интернет не
              является абсолютно безопасным, поэтому мы не можем гарантировать
              полную защиту.
            </P>
          </Section>

          <Section
            id="udalenie-uchetnoy-zapisi"
            title="10. Удаление учётной записи и срок хранения данных"
          >
            <P>
              Данные хранятся до тех пор, пока существует ваша учётная запись.
            </P>
            <P>
              <B>Как удалить учётную запись прямо в Приложении:</B>
            </P>
            <P>
              Откройте вкладку <B>«Профиль» → «Удалить аккаунт»</B> и подтвердите
              действие.
            </P>
            <P>
              При удалении учётной записи безвозвратно стираются: данные профиля,
              весь прогресс обучения, XP, серия дней, история занятий с
              ИИ-репетитором и статус подписки Tuti Plus. Восстановить эти данные
              будет невозможно.
            </P>
            <P>
              <B>Альтернативный способ:</B> направьте запрос на адрес{" "}
              <B>
                <Mail address="tutiapp08@gmail.com" />
              </B>{" "}
              с указанием e-mail вашей учётной записи. Мы удалим данные в течение{" "}
              <B>30 дней</B> с момента получения запроса.
            </P>
            <P>
              Отдельные обезличенные технические логи могут храниться дольше в
              целях безопасности, но они не позволяют вас идентифицировать.
            </P>
          </Section>

          <Section id="vashi-prava" title="11. Ваши права">
            <P>Вы имеете право:</P>
            <List
              items={[
                "получить информацию о том, какие ваши данные мы обрабатываем;",
                "запросить копию своих данных;",
                "потребовать исправления неточных данных;",
                "потребовать удаления данных;",
                "отозвать согласие на обработку;",
                "ограничить обработку отдельных категорий данных.",
              ]}
            />
            <P>
              Для реализации любого из этих прав напишите нам на{" "}
              <B>
                <Mail address="tutiapp08@gmail.com" />
              </B>
              . Мы ответим в течение <B>30 дней</B>.
            </P>
          </Section>

          <Section id="podpiska-tuti-plus" title="12. Подписка Tuti Plus">
            <P>
              Подписка Tuti Plus активируется в Приложении с помощью промокода.
              Оплата производится <B>вне Приложения</B>, через указанные нами
              каналы связи.
            </P>
            <P>
              Мы <B>не обрабатываем и не храним</B> данные ваших банковских карт
              и платёжных реквизитов. Обработка платежа выполняется
              соответствующей платёжной организацией в соответствии с её
              собственной политикой.
            </P>
            <P>
              В Приложении мы храним только: факт наличия статуса Plus, дату
              окончания подписки и использованный промокод.
            </P>
          </Section>

          <Section id="izmeneniya-v-politike" title="13. Изменения в Политике">
            <P>
              Мы можем время от времени обновлять настоящую Политику. Актуальная
              версия всегда доступна по адресу{" "}
              <B>
                <Link href="/privacy" className={linkClass}>
                  https://tutitj.com/privacy
                </Link>
              </B>
              . О существенных изменениях мы уведомим вас внутри Приложения.
            </P>
            <P>
              Продолжая использовать Приложение после вступления изменений в
              силу, вы принимаете обновлённую редакцию.
            </P>
          </Section>

          <Section id="kontakty" title="14. Контакты">
            <P>
              По любым вопросам, связанным с обработкой персональных данных:
            </P>
            <P>
              <B>Разработчик:</B> Tuti Team
              <br />
              <B>E-mail:</B> <Mail address="tutiapp08@gmail.com" />
              <br />
              <B>Адрес:</B> г. Душанбе, Республика Таджикистан
            </P>
          </Section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
