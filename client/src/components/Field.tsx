import { WarningCircleIcon } from "@phosphor-icons/react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  /** Текст ошибки под полем. Пустая строка или undefined: ошибки нет */
  error?: string;
  hint?: string;
  /** Элемент справа внутри поля, например кнопка «показать пароль» */
  trailing?: ReactNode;
}

/** Поле формы: подпись, ошибка и подсказка связаны с input для скринридеров */
export default function Field({ label, error, hint, trailing, className = "", ...input }: Props) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="title-4 text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          {...input}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`body-3 w-full rounded-lg border bg-surface px-3 py-3 text-ink transition-colors duration-300 ease-brand placeholder:text-subtle hover:border-border-action focus-visible:border-border-action disabled:pointer-events-none disabled:opacity-50 ${
            error ? "border-border-error" : "border-border-strong"
          } ${trailing ? "pr-12" : ""}`}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {error ? (
        <p id={`${id}-error`} className="caption-2 flex items-start gap-2 text-error">
          <WarningCircleIcon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="caption-2 text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
