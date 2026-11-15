import { HammerIcon } from "@phosphor-icons/react";
import Button from "./Button";

interface Props {
  title: string;
  description?: string;
}

/** Заглушка для страниц, которые ещё не сделаны. Замени её настоящей страницей. */
export default function ComingSoon({ title, description }: Props) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-lg bg-surface-selected text-info">
        <HammerIcon size={24} />
      </span>
      <h1 className="heading-4 text-ink">{title}</h1>
      <p className="body-3 text-muted">{description ?? "Эта страница в разработке."}</p>
      <Button to="/" variant="secondary">
        На главную
      </Button>
    </section>
  );
}
