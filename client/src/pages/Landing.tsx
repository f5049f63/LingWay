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
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import SituationIcon from "../components/SituationIcon";
import Stamp from "../components/Stamp";
import TaglineReveal from "../components/TaglineReveal";
import Tilt from "../components/Tilt";
import { situations } from "../data/situations";

const TRIAL_LESSON = "/lesson/airport-1";

/* ------------------------------------------------------------------ */
/* Общие куски                                                         */
/* ------------------------------------------------------------------ */

type Turn = { who: "agent" | "you"; en: string; ru: string };

function Bubble({ who, en, ru }: Turn) {
  const you = who === "you";
  return (
    <div
      className={`flex max-w-[85%] flex-col gap-1 ${you ? "items-end self-end" : "items-start"}`}
    >
      <p className="caption-4 text-subtle">{you ? "Вы" : "Собеседник"}</p>
      <div
        className={`rounded-xl px-4 py-3 text-left ${
          you ? "mat-action" : "mat-raised text-ink"
        } ${you ? "text-on-action" : ""}`}
      >
        <p className="body-2">{en}</p>
        <p className={`caption-5 mt-1 ${you ? "opacity-90" : "text-muted"}`}>{ru}</p>
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

/** Шаги автоматически сменяются и зацикливаются. При reduced motion показываем всё сразу. */
function useLoop(total: number, ms: number, start = 0) {
  const [step, setStep] = useState(start);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(total);
      return;
    }
    const id = setInterval(() => setStep((s) => (s >= total + 2 ? start : s + 1)), ms);
    return () => clearInterval(id);
  }, [total, ms, start]);
  return step;
}

/** Переменная --p: путь по маршруту для заполнения линии */
function useScrollVars(route: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      route.current?.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = route.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const p = (window.innerHeight * 0.6 - r.top) / r.height;
        el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [route]);
}

/* ------------------------------------------------------------------ */
/* Hero: стопка документов в 3D с живым диалогом                       */
/* ------------------------------------------------------------------ */

const heroTurns: Turn[] = [
  { who: "agent", en: "Where are you flying today?", ru: "Куда вы летите сегодня?" },
  { who: "you", en: "I'm flying to Lisbon.", ru: "Я лечу в Лиссабон." },
  { who: "agent", en: "Do you have any bags to check in?", ru: "У вас есть багаж для сдачи?" },
  { who: "you", en: "Just one suitcase, please.", ru: "Только один чемодан." },
];

function pop(on: boolean) {
  return `transition-[opacity,transform] duration-500 ease-brand ${
    on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
}

const layer = (z: number, extra = ""): CSSProperties => ({
  transform: `translateZ(${z}px) ${extra}`,
});

function HeroStack() {
  const step = useLoop(heroTurns.length + 1, 1600, 2);
  return (
    <Tilt
      mode="window"
      max={7}
      baseRx={2}
      baseRy={-6}
      className="mx-auto w-full max-w-sm"
      innerClassName="rounded-2xl"
    >
      {/* Штамп */}
      <div
        className={`absolute -right-2 -top-6 z-10 rounded-lg border-2 border-border-action bg-surface px-3 py-2 caption-3 text-info transition-[opacity,transform] duration-500 ease-brand ${
          step > heroTurns.length ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translateZ(110px) rotate(-10deg) scale(${step > heroTurns.length ? 1 : 0.85})`,
        }}
        aria-hidden="true"
      >
        Готово к вылету
      </div>

      {/* Основной талон */}
      <figure
        className="mat-lifted relative rounded-2xl text-left"
        aria-label="Пример диалога: регистрация на рейс"
        style={layer(0)}
      >
        <div className="mat-action flex items-center justify-between gap-4 rounded-t-2xl px-6 py-4 text-on-action">
          <p className="title-3">LingWay</p>
          <p className="caption-3">Посадочный талон</p>
        </div>
        <div className="grid grid-cols-3 gap-4 px-6 py-4">
          <div>
            <p className="caption-4 text-subtle">Пассажир</p>
            <p className="title-3 text-ink">Вы</p>
          </div>
          <div>
            <p className="caption-4 text-subtle">Куда</p>
            <p className="title-3 text-ink">Лиссабон</p>
          </div>
          <div>
            <p className="caption-4 text-subtle">Урок</p>
            <p className="title-3 text-ink">Аэропорт</p>
          </div>
        </div>

        {/* Линия отрыва: вырезы выглядят утопленными */}
        <div
          className="relative h-0 border-t-2 border-dashed border-border-strong"
          aria-hidden="true"
        >
          <span className="absolute -left-3 -top-3 size-6 rounded-full border border-border bg-surface" />
          <span className="absolute -right-3 -top-3 size-6 rounded-full border border-border bg-surface" />
        </div>

        <div className="flex min-h-[360px] flex-col gap-4 p-6">
          {heroTurns.map((t, i) => (
            <div key={t.en} className={pop(step > i)}>
              <Bubble {...t} />
            </div>
          ))}
          <div
            className={`mat-sunken mt-auto flex items-center justify-between gap-4 rounded-lg p-3 ${pop(step > heroTurns.length - 1)}`}
          >
            <p className="body-6 text-muted">Ответьте вслух или выберите фразу</p>
            <span className="mat-action flex size-10 shrink-0 items-center justify-center rounded-full text-on-action">
              <MicrophoneIcon size={20} aria-hidden="true" />
            </span>
          </div>
        </div>
      </figure>

      {/* Плавающая стеклянная карточка на отдельной глубине */}
      <div
        className="absolute -right-4 bottom-24 hidden md:block"
        style={layer(120)}
        aria-hidden="true"
      >
        <div className="float-b mat-lifted flex items-center gap-3 rounded-xl p-3">
          <span className="mat-action flex size-8 shrink-0 items-center justify-center rounded-full text-on-action">
            <LightningIcon size={16} />
          </span>
          <div className="text-left">
            <p className="title-4 text-ink">boarding pass</p>
            <p className="caption-5 text-muted">Повторить сегодня</p>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

/* ------------------------------------------------------------------ */
/* Примеры диалогов                                                    */
/* ------------------------------------------------------------------ */

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

function Phone({ demo }: { demo: (typeof demos)[number] }) {
  return (
    <div className="mat-device relative mx-auto w-80 rounded-4xl p-2">
      <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-3xl bg-surface">
        <span
          className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-device"
          aria-hidden="true"
        />
        <div className="mat-raised mt-0 rounded-none border-x-0 border-t-0 px-4 pb-3 pt-10">
          <p className="title-4 text-ink">{demo.title}</p>
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {demo.turns.map((t, i) => (
              <span
                key={t.en}
                className={`h-1 flex-1 rounded-full ${i < 3 ? "bg-action" : "bg-border-strong"}`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {demo.turns.map((t, i) => (
            <div key={t.en} className="bubble-in" style={{ animationDelay: `${i * 160}ms` }}>
              <Bubble {...t} />
            </div>
          ))}
        </div>
        <div className="mat-sunken m-3 flex items-center justify-between gap-3 rounded-2xl p-3">
          <p className="caption-2 text-muted">Ответьте вслух</p>
          <span className="mat-action flex size-10 shrink-0 items-center justify-center rounded-full text-on-action">
            <MicrophoneIcon size={20} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

function DemoSection() {
  const [active, setActive] = useState(demos[0].key);
  const demo = demos.find((d) => d.key === active) ?? demos[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionTitle
        title="Так звучит диалог в уроке"
        text="Выберите ситуацию и прочитайте пример. В уроке вы отвечаете сами, вслух или выбором фразы."
      />
      <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_360px]">
        <div
          role="tablist"
          aria-label="Ситуации"
          className="mat-sunken flex flex-col gap-2 rounded-3xl p-2"
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
                className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-[transform,background-color] duration-500 ease-brand active:scale-[0.98] ${
                  on
                    ? "mat-lifted border-border-action"
                    : "border border-transparent hover:bg-surface-hover"
                }`}
              >
                <SituationIcon name={d.icon} />
                <span className="flex flex-col">
                  <span className="title-1 text-ink">{d.label}</span>
                  <span className="caption-2 text-muted">{d.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="relative">
          <Tilt
            mode="hover"
            max={6}
            baseRx={2}
            baseRy={-6}
            innerClassName="rounded-4xl"
            className="relative"
          >
            <Phone key={active} demo={demo} />
          </Tilt>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Польза: цветное бенто                                               */
/* ------------------------------------------------------------------ */

const mini = "mat-raised rounded-lg p-4 text-ink";

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
      <span className="mat-action flex size-10 items-center justify-center rounded-full text-on-action">
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
          className="mat-sunken flex items-center justify-between gap-3 rounded-lg px-3 py-2"
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
      <div className="mat-sunken flex items-center gap-2 rounded-lg px-3 py-2">
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
    tone: "mat-action text-on-action",
    sub: "text-on-action opacity-90",
  },
  {
    icon: MicrophoneIcon,
    title: "Отвечаете вслух",
    text: "В диалогах вы не только читаете, а произносите ответ и слышите образец.",
    visual: <VoiceMini />,
    tone: "mat-ink text-inverted",
    sub: "text-inverted opacity-80",
  },
  {
    icon: LightningIcon,
    title: "Слова возвращаются вовремя",
    text: "То, в чём вы ошиблись, снова появляется в практике через интервалы, пока не запомнится.",
    visual: <ReviewMini />,
    tone: "mat-raised text-ink",
    sub: "text-muted",
  },
  {
    icon: BookOpenIcon,
    title: "Разговорник под рукой",
    text: "Все фразы по темам находятся за секунду, даже если нет времени на урок. Удобно прямо в дороге.",
    visual: <PhrasebookMini />,
    wide: true,
    tone: "mat-lifted text-ink",
    sub: "text-muted",
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

function SituationsMini() {
  return (
    <div className="mat-raised grid grid-cols-4 gap-2 rounded-lg p-3" aria-hidden="true">
      {situations.slice(0, 8).map((s) => (
        <SituationIcon key={s.slug} name={s.icon} size={20} />
      ))}
    </div>
  );
}

const stepVisuals = [<SituationsMini key="a" />, <VoiceMini key="b" />, <ReviewMini key="c" />];

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
  const route = useRef<HTMLOListElement>(null);
  useScrollVars(route);

  return (
    <div className="relative isolate overflow-x-clip">
      {/* 1. Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-4 pb-20 pt-12 lg:grid-cols-[1fr_384px] lg:gap-12">
        <div>
          <h1 className="heading-1 hero-text max-w-[680px]">
            Английский, который <br className="hidden md:block" />
            пригодится в поездке
          </h1>
          <p className="body-3 mt-6 max-w-[680px] text-muted md:text-lg">
            LingWay учит конкретным моментам поездки: регистрация на рейс, заселение в отель, заказ
            в кафе. Короткие уроки, фразы с озвучкой и диалоги, в которых отвечаете вы.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <Button to={TRIAL_LESSON} size="lg">
              Пройти урок про аэропорт
              <ArrowRightIcon size={20} />
            </Button>
            <p className="caption-2 text-subtle">
              Бесплатно, в браузере. Первый урок без регистрации
            </p>
          </div>
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Ситуации">
            {situations.map((s) => (
              <li key={s.slug} className="mat-raised rounded-full px-3 py-1 caption-1 text-muted">
                {s.title}
              </li>
            ))}
          </ul>
        </div>
        <HeroStack />
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

      {/* 3. Проблема и решение: утопленная и поднятая поверхности */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Учебник готовит к экзамену, а в поездке нужны конкретные фразы" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="mat-sunken h-full rounded-2xl p-6">
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
            <Tilt mode="hover" max={3} className="h-full">
              <div className="mat-lifted h-full rounded-2xl border-border-action p-6">
                <p className="caption-3 text-info">Как учим мы</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {[
                    "Начинаете с ситуации, которая ждёт вас в поездке",
                    "Учите фразы целиком: их можно сразу сказать",
                    "Отвечаете в диалоге вслух, пока рядом нет живого собеседника",
                  ].map((t) => (
                    <li key={t} className="body-3 flex items-start gap-3 text-ink">
                      <CheckCircleIcon
                        size={24}
                        className="shrink-0 text-info"
                        aria-hidden="true"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* 4. Примеры диалогов в телефоне */}
      <DemoSection />

      {/* 5. Польза: наклоняемые плитки, мини интерфейсы приподняты над плиткой */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Всё, что нужно в дороге, в одном месте" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 100} className={b.wide ? "md:col-span-2" : ""}>
              <Tilt mode="hover" max={4} className="h-full">
                <article
                  className={`preserve-3d flex h-full flex-col gap-6 rounded-2xl p-6 ${b.tone}`}
                >
                  <div style={{ transform: "translateZ(36px)" }}>{b.visual}</div>
                  <div className="flex flex-col gap-2" style={{ transform: "translateZ(16px)" }}>
                    <h3 className="heading-6 flex items-center gap-3">
                      <b.icon size={24} className="shrink-0" aria-hidden="true" />
                      {b.title}
                    </h3>
                    <p className={`body-3 ${b.sub}`}>{b.text}</p>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Как работает: стопка карточек, каждая прилипает и ложится поверх */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle title="Три шага от «не знаю, что сказать» до готовой фразы" />
        <ol className="mt-12 flex flex-col gap-12 md:gap-24">
          {steps.map((s, i) => (
            <li key={s.title} className="md:sticky" style={{ top: 96 + i * 24 } as CSSProperties}>
              <Reveal>
                <div className="mat-lifted grid gap-6 rounded-3xl p-6 md:grid-cols-[64px_1fr_280px] md:items-center md:gap-8 md:p-8">
                  <span
                    className="mat-action flex size-16 items-center justify-center rounded-2xl heading-3 text-on-action"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="heading-4 text-ink">{s.title}</h3>
                    <p className="body-3 text-muted">{s.text}</p>
                  </div>
                  <div className="mat-sunken rounded-2xl p-3">{stepVisuals[i]}</div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. Маршрут: линия заполняется по мере прокрутки */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle
          title="Маршрут из восьми остановок"
          text="Идите по порядку или сразу к нужной. Каждая остановка это одна ситуация поездки со своими уроками."
        />
        <ol ref={route} className="relative mt-12 flex flex-col gap-6">
          <span
            className="mat-sunken absolute bottom-0 left-4 top-0 w-1 -translate-x-1/2 rounded-full md:left-1/2"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-0 left-4 top-0 w-1 origin-top -translate-x-1/2 rounded-full bg-action md:left-1/2"
            style={{ transform: "translateX(-50%) scaleY(var(--p, 0))" }}
            aria-hidden="true"
          />
          {situations.map((s, i) => (
            <li key={s.slug} className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span className="mat-action absolute left-0 top-4 z-10 flex size-8 items-center justify-center rounded-full caption-3 text-on-action ring-4 ring-surface md:left-1/2 md:-translate-x-1/2">
                {i + 1}
              </span>
              <Reveal className={i % 2 === 0 ? "md:col-start-1" : "md:col-start-2"}>
                <Tilt mode="hover" max={4}>
                  <Link
                    to={`/situation/${s.slug}`}
                    className="mat-raised group flex flex-col gap-4 rounded-2xl p-4 transition-colors duration-300 ease-brand hover:border-border-strong"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <SituationIcon name={s.icon} />
                        <h3 className="title-1 text-ink">{s.title}</h3>
                      </div>
                      <ArrowRightIcon
                        size={20}
                        className="shrink-0 text-icon-subtle transition-transform duration-500 ease-brand group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="body-6 text-muted">{s.description}</p>
                    <div className="mat-sunken rounded-lg px-3 py-2 text-left">
                      <p className="title-4 text-ink">{s.phrase}</p>
                      <p className="caption-5 text-muted">{s.phraseRu}</p>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* 8. FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <Reveal>
          <h2 className="heading-2 text-ink">Частые вопросы</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-3">
          {faq.map((item) => (
            <details key={item.q} className="mat-raised group rounded-2xl open:mat-sunken">
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

      {/* 9. Финальный CTA: свет, штампы, объём */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-12">
        <Reveal>
          <div className="mat-action relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl px-6 py-20 text-center text-on-action">
            <Stamp
              size={200}
              className="spin-slow absolute -left-12 -top-12 text-on-action opacity-20"
            />
            <h2 className="heading-2 relative max-w-[680px]">Первый урок займёт несколько минут</h2>
            <p className="body-3 relative max-w-[680px] opacity-90 md:text-lg">
              Бесплатно, без регистрации и без установки. Откройте урок про аэропорт и ответьте на
              первый вопрос сотрудника стойки.
            </p>
            <Button to={TRIAL_LESSON} size="lg" variant="light" className="relative">
              Пройти урок про аэропорт
              <ArrowRightIcon size={20} />
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
