import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface Props {
  children: ReactNode;
  className?: string;
  /** Задержка в миллисекундах для ступенчатого появления */
  delay?: number;
}

/** Блок поднимается на 32px и проявляется один раз при входе в экран */
export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-in={inView}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
