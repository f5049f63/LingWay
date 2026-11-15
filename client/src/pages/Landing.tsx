import {
  ArrowRightIcon,
  BookOpenIcon,
  ChatsIcon,
  CheckCircleIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SpeakerHighIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import SituationIcon from "../components/SituationIcon";
import TaglineReveal from "../components/TaglineReveal";
import { situations } from "../data/situations";

const TRIAL_LESSON = "/lesson/airport-1";

/* ------------------------------------------------------------------ */
/* Общие куски                                                         */
/* ------------------------------------------------------------------ */

function Bubble({ who, en, ru }: { who: "agent" | "you"; en: string; ru: string }) {
  const you = who === "you";
  return (
    <div
      className={`flex max-w-[85%] flex-col gap-1 ${you ? "items-end self-end" : "items-start"}`}
    >
      <p className="caption-4 text-subtle">{you ? "Вы" : "Собеседник"}</p>
      <div
        className={`rounded-xl px-4 py-3 text-left ${
          you ? "bg-action text-on-action" : "border border-border bg-surface-subtle text-ink"
        }`}
      >
        <p className="body-2">{en}</p>
        <p className={`caption-5 mt-1 ${you ? "opacity-80" : "text-muted"}`}>{ru}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title, text }: { title: string; text?: string }) {
  return (
    <Reveal>
      <h2 className="heading-2 max-w-3xl text-ink">{title}</h2>
      {text && <p className="body-3 mt-4 max-w-2xl text-muted md:text-lg">{text}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Плавающие карточки по бокам, только на широких экранах */}
      <Reveal delay={500} className="absolute -left-60 top-24 z-10 hidden w-56 xl:block">
        <div className="rounded-xl border border-border bg-surface-raised p-3 text-left">
          <p className="caption-4 text-subtle">Фраза</p>
          <p className="title-3 mt-1 flex items-start gap-2 text-ink">
            <SpeakerHighIcon size={20} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
            Could I have a window seat?
          </p>
          <p className="caption-5 mt-1 text-muted">Можно место у окна?</p>
        </div>
      </Reveal>
      <Reveal delay={700} className="absolute -right-60 bottom-20 z-10 hidden w-56 xl:block">
        <div className="rounded-xl border border-border bg-surface-raised p-3 text-left">
          <p className="caption-4 text-subtle">Повторение</p>
          <p className="title-3 mt-1 text-ink">boarding pass</p>
          <p className="caption-5 mt-1 flex items-center gap-1 text-success">
            <CheckCircleIcon size={16} aria-hidden="true" />
            Запомнилось, вернётся завтра
          </p>
        </div>
      </Reveal>

      <figure
        className="w-full rounded-2xl border border-border bg-surface-subtle p-2 text-left"
        aria-label="Пример диалога в уроке: регистрация на рейс"
      >
        <div className="rounded-lg border border-border bg-surface-raised">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <div>
              <p className="title-4 text-ink">Регистрация на рейс</p>
              <p className="caption-5 text-subtle">Аэропорт, урок 1</p>
            </div>
            <div
              className="h-2 w-24 overflow-hidden rounded-full bg-surface-hover"
              role="img"
              aria-label="Пройдено 2 из 5 шагов"
            >
              <div className="h-full w-2/5 rounded-full bg-action" />
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <Reveal delay={200}>
              <Bubble who="agent" en="Where are you flying today?" ru="Куда вы летите сегодня?" />
            </Reveal>
            <Reveal delay={400} className="flex flex-col">
              <Bubble who="you" en="I'm flying to Lisbon." ru="Я лечу в Лиссабон." />
            </Reveal>
            <Reveal delay={600}>
              <Bubble
                who="agent"
                en="Do you have any bags to check in?"
                ru="У вас есть багаж для сдачи?"
              />
            </Reveal>
            <Reveal delay={800}>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-3">
                <p className="body-6 text-muted">Нажмите и ответьте вслух</p>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-action text-on-action">
                  <MicrophoneIcon size={20} />
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Примеры диалогов                                                    */
/* ------------------------------------------------------------------ */

type Turn = { who: "agent" | "you"; en: string; ru: string };

const demos: {
  key: string;
  label: string;
  icon: "airport" | "hotel" | "cafe";
  title: string;
  turns: Turn[];
}[] = [
  {
    key: "airport",
    label: "Аэропорт",
    icon: "airport",
    title: "У стойки регистрации",
    turns: [
      {
        who: "agent",
        en: "Good morning. May I see your passport?",
        ru: "Доброе утро. Можно ваш паспорт?",
      },
      { who: "you", en: "Here you are.", ru: "Вот, пожалуйста." },
      { who: "agent", en: "Do you have any bags to check in?", ru: "У вас есть багаж для сдачи?" },
      { who: "you", en: "I have one suitcase.", ru: "У меня один чемодан." },
    ],
  },
  {
    key: "hotel",
    label: "Отель",
    icon: "hotel",
    title: "На ресепшене",
    turns: [
      {
        who: "agent",
        en: "Welcome. Do you have a reservation?",
        ru: "Добро пожаловать. У вас есть бронь?",
      },
      { who: "you", en: "Yes, under the name Ivanova.", ru: "Да, на фамилию Иванова." },
      { who: "agent", en: "Breakfast is from seven to ten.", ru: "Завтрак с семи до десяти." },
      { who: "you", en: "Thank you. Where is the lift?", ru: "Спасибо. Где лифт?" },
    ],
  },
  {
    key: "cafe",
    label: "Кафе",
    icon: "cafe",
    title: "За столиком",
    turns: [
      {
        who: "agent",
        en: "Hi, are you ready to order?",
        ru: "Здравствуйте, готовы сделать заказ?",
      },
      {
        who: "you",
        en: "I'd like the soup and a coffee, please.",
        ru: "Мне суп и кофе, пожалуйста.",
      },
      { who: "agent", en: "Would you like anything else?", ru: "Желаете ещё что нибудь?" },
      {
        who: "you",
        en: "No, thank you. Could we have the bill?",
        ru: "Нет, спасибо. Принесите счёт.",
      },
    ],
  },
];

function DemoSection() {
  const [active, setActive] = useState(demos[0].key);
  const demo = demos.find((d) => d.key === active) ?? demos[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle
        title="Так выглядит диалог в уроке"
        text="Выберите ситуацию и прочитайте пример. В уроке вы отвечаете сами, вслух или выбором фразы."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div
          role="tablist"
          aria-label="Ситуации"
          className="flex gap-2 overflow-x-auto lg:flex-col"
        >
          {demos.map((d) => {
            const on = d.key === active;
            return (
              <button
                key={d.key}
                role="tab"
                type="button"
                id={`tab-${d.key}`}
                aria-selected={on}
                aria-controls="demo-panel"
                onClick={() => setActive(d.key)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition-[background-color,border-color,transform] duration-300 ease-brand active:scale-[0.98] ${
                  on
                    ? "border-border-action bg-surface-selected"
                    : "border-border bg-surface-raised hover:border-border-strong hover:bg-surface-hover"
                }`}
              >
                <SituationIcon name={d.icon} />
                <span className="title-2 text-ink">{d.label}</span>
              </button>
            );
          })}
        </div>

        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="rounded-2xl border border-border bg-surface-subtle p-2"
        >
          <Reveal key={active}>
            <div className="rounded-lg border border-border bg-surface-raised">
              <div className="border-b border-border px-4 py-3">
                <p className="title-4 text-ink">{demo.title}</p>
                <p className="caption-5 text-subtle">{demo.label}, пример диалога</p>
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-6">
                {demo.turns.map((t) => (
                  <Bubble key={t.en} {...t} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Польза: бенто с мини интерфейсами                                   */
/* ------------------------------------------------------------------ */

const mini = "rounded-lg border border-border bg-surface p-4";

function PhrasesMini() {
  const rows = [
    ["Could I have a window seat?", "Можно место у окна?"],
    ["Where is gate twelve?", "Где выход номер двенадцать?"],
    ["I have a reservation.", "У меня есть бронь."],
  ];
  return (
    <div className={`${mini} flex flex-col gap-3`}>
      {rows.map(([en, ru]) => (
        <div key={en} className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-selected text-info">
            <SpeakerHighIcon size={16} aria-hidden="true" />
          </span>
          <div className="text-left">
            <p className="title-4 text-ink">{en}</p>
            <p className="caption-5 text-muted">{ru}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VoiceMini() {
  const bars = [0.3, 0.55, 0.8, 0.45, 1, 0.6, 0.9, 0.4, 0.7, 0.35, 0.5];
  return (
    <div className={`${mini} flex flex-col items-center gap-4`}>
      <div className="flex h-12 items-center gap-1" aria-hidden="true">
        {bars.map((b, i) => (
          <span
            key={i}
            className="h-12 w-1 origin-center rounded-full bg-action"
            style={{ transform: `scaleY(${b})` }}
          />
        ))}
      </div>
      <p className="caption-2 text-muted">Повторите: I&apos;d like a coffee, please</p>
      <span className="flex size-10 items-center justify-center rounded-full bg-action text-on-action">
        <MicrophoneIcon size={20} aria-hidden="true" />
      </span>
    </div>
  );
}

function ReviewMini() {
  const rows = [
    ["boarding pass", "Повторить сегодня"],
    ["receipt", "Завтра"],
    ["aisle seat", "Через несколько дней"],
  ];
  return (
    <div className={`${mini} flex flex-col gap-2`}>
      {rows.map(([w, when], i) => (
        <div
          key={w}
          className="flex items-center justify-between gap-3 rounded-lg bg-surface-subtle px-3 py-2"
        >
          <p className="title-4 text-ink">{w}</p>
          <p className={`caption-4 ${i === 0 ? "text-info" : "text-subtle"}`}>{when}</p>
        </div>
      ))}
    </div>
  );
}

function PhrasebookMini() {
  const rows = [
    ["boarding pass", "посадочный талон"],
    ["boarding gate", "выход на посадку"],
    ["boarding time", "время посадки"],
  ];
  return (
    <div className={`${mini} flex flex-col gap-3`}>
      <div className="flex items-center gap-2 rounded-lg border border-border-strong px-3 py-2">
        <MagnifyingGlassIcon size={20} className="text-icon-subtle" aria-hidden="true" />
        <p className="body-5 text-ink">boarding</p>
      </div>
      {rows.map(([en, ru]) => (
        <div key={en} className="flex items-center justify-between gap-3 px-1">
          <p className="title-4 text-ink">{en}</p>
          <p className="caption-2 text-muted">{ru}</p>
        </div>
      ))}
    </div>
  );
}

const benefits = [
  {
    icon: ChatsIcon,
    title: "Фразы под вашу ситуацию",
    text: "Каждая тема собрана вокруг одного места: аэропорт, отель, кафе. Вы учите то, что скажете там на самом деле.",
    visual: <PhrasesMini />,
    wide: true,
  },
  {
    icon: MicrophoneIcon,
    title: "Отвечаете вслух",
    text: "В диалогах вы не только читаете, а произносите ответ и слышите образец.",
    visual: <VoiceMini />,
  },
  {
    icon: LightningIcon,
    title: "Слова возвращаются вовремя",
    text: "То, в чём вы ошиблись, снова появляется в практике через интервалы, пока не запомнится.",
    visual: <ReviewMini />,
  },
  {
    icon: BookOpenIcon,
    title: "Разговорник под рукой",
    text: "Все фразы по темам находятся за секунду, даже если нет времени на урок. Удобно прямо в дороге.",
    visual: <PhrasebookMini />,
    wide: true,
  },
];

/* ------------------------------------------------------------------ */
/* Шаги, FAQ                                                           */
/* ------------------------------------------------------------------ */

const steps = [
  {
    title: "Выберите ситуацию",
    text: "Аэропорт, отель, транспорт или любая из восьми тем. Начните с той, что ближе всего по датам поездки.",
  },
  {
    title: "Пройдите короткий урок",
    text: "Послушайте фразы, повторите их вслух и ответьте в диалоге. Каждый шаг короткий, его можно сделать по дороге на работу.",
  },
  {
    title: "Закрепите в практике",
    text: "Слова и фразы, в которых вы ошиблись, возвращаются в повторении. Вы видите, что уже готово, а что стоит повторить.",
  },
];

const faq = [
  {
    q: "Нужно ли знать английский заранее?",
    a: "Нет. Первые уроки состоят из коротких фраз с переводом и озвучкой, дальше диалоги становятся длиннее.",
  },
  {
    q: "Сколько это стоит?",
    a: "Сейчас LingWay бесплатный. Платных тарифов нет, установка не нужна: всё работает в браузере.",
  },
  {
    q: "Нужна ли регистрация?",
    a: "Пробный урок и разговорник открываются без неё. Прогресс гостя хранится в браузере, а после регистрации переносится в аккаунт.",
  },
  {
    q: "Можно ли заниматься с телефона?",
    a: "Да. Сайт рассчитан на экран телефона, а главное действие всегда видно без прокрутки.",
  },
  {
    q: "Чем это отличается от обычных приложений для английского?",
    a: "LingWay не учит язык целиком. Темы построены вокруг ситуаций поездки, поэтому каждая фраза сразу пригодится.",
  },
  {
    q: "Кто сделал проект?",
    a: "Это учебный проект студенческой команды. Мы развиваем его и принимаем замечания.",
  },
];

/* ------------------------------------------------------------------ */
/* Страница                                                            */
/* ------------------------------------------------------------------ */

export default function Landing() {
  return (
    <>
      {/* 1. Hero */}
      <section className="px-4 pb-24 pt-16 text-center">
        <h1 className="heading-1 hero-text mx-auto max-w-[680px]">
          Английский, который <br className="hidden md:block" />
          пригодится в поездке
        </h1>
        <p className="body-3 mx-auto mt-6 max-w-[680px] text-muted md:text-lg">
          LingWay учит конкретным моментам поездки: регистрация на рейс, заселение в отель, заказ в
          кафе. Короткие уроки, фразы с озвучкой и диалоги, в которых отвечаете вы.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button to={TRIAL_LESSON} size="lg">
            Пройти урок про аэропорт
            <ArrowRightIcon size={20} />
          </Button>
          <p className="caption-2 text-subtle">
            Бесплатно, в браузере. Первый урок без регистрации
          </p>
        </div>
        <div className="mt-16">
          <HeroVisual />
        </div>
        <ul
          className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2"
          aria-label="Ситуации"
        >
          {situations.map((s) => (
            <li
              key={s.slug}
              className="rounded-full border border-border bg-surface-raised px-3 py-1 caption-1 text-muted"
            >
              {s.title}
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Tagline reveal */}
      <section className="mx-auto max-w-6xl px-4 py-20" aria-label="Идея проекта">
        <TaglineReveal
          lines={[
            "Вам не нужен весь английский.",
            "Нужно уметь ответить у стойки,",
            "на ресепшене и в кафе.",
          ]}
        />
      </section>

      {/* 3. Проблема и решение */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Учебник готовит к экзамену, а в поездке нужны конкретные фразы" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-surface-subtle p-6">
              <p className="caption-3 text-subtle">Как учат обычно</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Месяцы грамматики до первой полезной фразы",
                  "Слова из случайных тем, которые не встретятся в дороге",
                  "Страх сказать вслух, потому что говорить не тренировали",
                ].map((t) => (
                  <li key={t} className="body-3 text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-border-action bg-surface-raised p-6">
              <p className="caption-3 text-info">Как учим мы</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Начинаете с ситуации, которая ждёт вас в поездке",
                  "Учите фразы целиком: их можно сразу сказать",
                  "Отвечаете в диалоге вслух, пока рядом нет живого собеседника",
                ].map((t) => (
                  <li key={t} className="body-3 flex items-start gap-3 text-ink">
                    <CheckCircleIcon size={24} className="shrink-0 text-info" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Примеры диалогов */}
      <DemoSection />

      {/* 5. Польза */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Всё, что нужно в дороге, в одном месте" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 100} className={b.wide ? "md:col-span-2" : ""}>
              <article className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-6">
                {b.visual}
                <div className="flex flex-col gap-2">
                  <h3 className="heading-6 flex items-center gap-3 text-ink">
                    <b.icon size={24} className="shrink-0 text-info" aria-hidden="true" />
                    {b.title}
                  </h3>
                  <p className="body-3 text-muted">{b.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Как работает */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Три шага от «не знаю, что сказать» до готовой фразы" />
        <ol className="mt-12 flex flex-col gap-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal>
                <div className="grid gap-4 rounded-2xl bg-surface-subtle p-6 md:grid-cols-[96px_1fr_1fr] md:items-center md:gap-8">
                  <p className="heading-1 text-info" aria-hidden="true">
                    {i + 1}
                  </p>
                  <h3 className="heading-4 text-ink">{s.title}</h3>
                  <p className="body-3 text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. Ситуации: бенто с примерами фраз */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle
          title="Восемь ситуаций, которые встретятся в поездке"
          text="Откройте любую, чтобы увидеть уроки. Порядок не важен, можно начать с самой волнующей."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {situations.map((s, i) => {
            const big = i === 0 || i === 3;
            return (
              <li key={s.slug} className={big ? "lg:col-span-2" : ""}>
                <Reveal delay={(i % 4) * 60} className="h-full">
                  <Link
                    to={`/situation/${s.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-4 transition-[background-color,border-color,transform] duration-300 ease-brand hover:-translate-y-1 hover:border-border-strong hover:bg-surface-hover active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <SituationIcon name={s.icon} />
                      <ArrowRightIcon
                        size={20}
                        className="text-icon-subtle transition-transform duration-500 ease-brand group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="title-2 text-ink">{s.title}</h3>
                      <p className="body-6 text-muted">{s.description}</p>
                    </div>
                    <div className="mt-auto rounded-lg border border-border bg-surface px-3 py-2 text-left">
                      <p className="title-4 text-ink">{s.phrase}</p>
                      <p className="caption-5 text-muted">{s.phraseRu}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 8. FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <Reveal>
          <h2 className="heading-2 text-ink">Частые вопросы</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-surface-raised open:bg-surface-subtle"
            >
              <summary className="title-2 flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-4 text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative size-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-full before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-full after:w-0.5 after:bg-ink group-open:after:hidden"
                />
              </summary>
              <p className="body-3 px-4 pb-4 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9. Финальный CTA, тот же что в hero */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-12">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface-inverted px-6 py-16 text-center">
            <h2 className="heading-3 max-w-[680px] text-inverted">
              Первый урок займёт несколько минут
            </h2>
            <p className="body-3 max-w-[680px] text-inverted opacity-80">
              Бесплатно, без регистрации и без установки. Откройте урок про аэропорт и ответьте на
              первый вопрос сотрудника стойки.
            </p>
            <Button
              to={TRIAL_LESSON}
              size="lg"
              className="!bg-surface !text-ink hover:!bg-surface-hover"
            >
              Пройти урок про аэропорт
              <ArrowRightIcon size={20} />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
