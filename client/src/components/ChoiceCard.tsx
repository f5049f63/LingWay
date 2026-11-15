import { CheckCircleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface Props {
  /** Общее имя группы: по нему браузер даёт переключать варианты стрелками */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  text?: string;
  /** Плитка слева: иконка или короткий код */
  lead?: ReactNode;
  disabled?: boolean;
}

/**
 * Вариант ответа. Внутри настоящий radio, поэтому работают клавиатура и скринридер.
 * Выбранный вариант отмечается рамкой, фоном и галочкой, не одним цветом.
 */
export default function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  text,
  lead,
  disabled,
}: Props) {
  return (
    <label
      className={`mat-raised lift group relative flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors duration-300 ease-brand has-[:checked]:border-border-action has-[:checked]:bg-surface-selected has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {lead && (
        <span className="title-2 flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-selected text-info transition-colors duration-300 ease-brand group-has-[:checked]:bg-surface">
          {lead}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="body-2 text-ink">{title}</span>
        {text && <span className="caption-2 text-muted">{text}</span>}
      </span>
      <CheckCircleIcon
        size={24}
        aria-hidden="true"
        className="shrink-0 text-info opacity-0 transition-opacity duration-300 ease-brand group-has-[:checked]:opacity-100"
      />
    </label>
  );
}
