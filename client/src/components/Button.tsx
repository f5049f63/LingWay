import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "tertiary" | "light";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg transition-[background-color,color,border-color] duration-300 ease-brand aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50";

// Основные кнопки: 8px по вертикали и 12px по горизонтали. Крупная кнопка для CTA: 12 и 16.
const sizes: Record<Size, string> = {
  sm: "px-3 py-2 button-sm",
  md: "px-3 py-2 button-md",
  lg: "px-4 py-3 button-lg",
};

const variants: Record<Variant, string> = {
  primary: "mat-action press text-on-action",
  light: "mat-raised text-ink hover:bg-surface-hover active:scale-[0.98]",
  secondary: "mat-raised text-ink hover:bg-surface-hover active:scale-[0.98]",
  tertiary: "text-ink hover:bg-surface-hover active:bg-surface-selected active:scale-[0.98]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  onClick,
  type = "button",
  disabled,
  className = "",
}: Props) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
