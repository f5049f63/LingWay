import type { ReactNode } from "react";
import Stamp from "./Stamp";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Заголовок и текст на цветной панели справа (только на широких экранах) */
  asideTitle?: string;
  asideText?: string;
}

/** Общий каркас страниц входа, регистрации и восстановления: форма слева, диалог из урока справа */
export default function AuthShell({
  title,
  subtitle,
  children,
  asideTitle = "Продолжите маршрут",
  asideText = "Фразы, диалоги и повторение ждут вас там, где вы остановились.",
}: Props) {
  return (
    <section className="mx-auto grid max-w-6xl items-stretch gap-6 px-4 py-12 lg:grid-cols-2">
      <div className="mat-raised flex flex-col justify-center rounded-3xl p-6 md:p-12">
        <h1 className="heading-4 text-ink">{title}</h1>
        <p className="body-3 mt-2 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>

      <aside
        className="mat-action relative hidden flex-col justify-between gap-12 overflow-hidden rounded-3xl p-12 text-on-action lg:flex"
        aria-hidden="true"
      >
        <Stamp size={240} className="absolute -right-12 -top-12 text-on-action opacity-20" />
        <div className="relative">
          <p className="heading-3 max-w-xs">{asideTitle}</p>
          <p className="body-3 mt-4 max-w-xs opacity-90">{asideText}</p>
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="mat-raised max-w-[80%] self-start rounded-xl px-4 py-3 text-ink">
            <p className="body-2">Where are you flying today?</p>
            <p className="caption-5 mt-1 text-muted">Куда вы летите сегодня?</p>
          </div>
          <div className="max-w-[80%] self-end rounded-xl bg-surface-inverted px-4 py-3 text-inverted">
            <p className="body-2">I&apos;m flying to Lisbon.</p>
            <p className="caption-5 mt-1 opacity-80">Я лечу в Лиссабон.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
