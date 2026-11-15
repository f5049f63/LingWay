import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState, type ComponentProps } from "react";
import Field from "./Field";

type Props = Omit<ComponentProps<typeof Field>, "type" | "trailing">;

/** Поле пароля с кнопкой «показать / скрыть» */
export default function PasswordField(props: Props) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          aria-pressed={show}
          className="flex size-10 items-center justify-center rounded-lg text-icon-subtle transition-colors duration-300 ease-brand hover:bg-surface-hover hover:text-ink active:scale-[0.98]"
        >
          {show ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
        </button>
      }
    />
  );
}
