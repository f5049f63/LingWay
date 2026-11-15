import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Классы внешней сцены (размеры, позиция) */
  className?: string;
  /** Классы наклоняемого слоя (радиус, фон) */
  innerClassName?: string;
  /** Максимальный наклон в градусах */
  max?: number;
  /** window: слой следит за курсором по всей странице. hover: наклон только при наведении */
  mode?: "window" | "hover";
  /** Покой: наклон по умолчанию, чтобы объём был виден и без мыши */
  baseRx?: number;
  baseRy?: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Наклон слоя в 3D. На touch и при reduced motion остаётся только покой. */
export default function Tilt({
  children,
  className = "",
  innerClassName = "rounded-2xl",
  max = 8,
  mode = "hover",
  baseRx = 0,
  baseRy = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    const set = (nx: number, ny: number) => {
      el.style.setProperty("--ry", `${nx * max}deg`);
      el.style.setProperty("--rx", `${-ny * max}deg`);
      el.style.setProperty("--mx", `${50 + nx * 50}%`);
      el.style.setProperty("--my", `${50 + ny * 50}%`);
    };

    if (mode === "window") {
      const onMove = (e: PointerEvent) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const nx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
          const ny = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
          set(nx, ny);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        cancelAnimationFrame(raf);
      };
    }

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      set(0, 0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [mode, max]);

  const style = { "--base-rx": `${baseRx}deg`, "--base-ry": `${baseRy}deg` } as CSSProperties;

  return (
    <div className={`tilt-stage ${className}`}>
      <div ref={ref} className={`tilt relative h-full ${innerClassName}`} style={style}>
        {children}
      </div>
    </div>
  );
}
