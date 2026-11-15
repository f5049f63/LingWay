import { CompassIcon } from "@phosphor-icons/react";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-lg bg-surface-selected text-info">
        <CompassIcon size={32} />
      </span>
      <p className="caption-3 text-info">Ошибка 404</p>
      <h1 className="heading-3 text-ink">Здесь нет маршрута</h1>
      <p className="body-3 max-w-md text-muted">
        Ссылка устарела или в адресе опечатка. Вернитесь на главную или откройте путь обучения.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button to="/">На главную</Button>
        <Button to="/learn" variant="secondary">
          К урокам
        </Button>
      </div>
    </section>
  );
}
