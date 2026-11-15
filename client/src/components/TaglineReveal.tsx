import { useEffect, useRef, useState } from "react";

interface Props {
  /** Строки текста. Минимум две. Каждая строка переносится отдельно. */
  lines: string[];
}

/**
 * Крупный текст, слова которого по очереди переходят из приглушённого тона в основной,
 * когда пересекают линию на 60% высоты экрана. IntersectionObserver на каждое слово.
 */
export default function TaglineReveal({ lines }: Props) {
  const root = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState<Set<number>>(new Set());

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const words = Array.from(node.querySelectorAll<HTMLElement>("[data-word]"));
    if (typeof IntersectionObserver === "undefined") {
      setActive(new Set(words.map((_, i) => i)));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting || e.boundingClientRect.top < 0);
        if (hit.length === 0) return;
        setActive((prev) => {
          const next = new Set(prev);
          for (const entry of hit) {
            next.add(Number((entry.target as HTMLElement).dataset.word));
            observer.unobserve(entry.target);
          }
          return next;
        });
      },
      // слово активируется, когда поднимается выше линии на 60% высоты окна
      { rootMargin: "0px 0px -40% 0px" },
    );
    words.forEach((w) => observer.observe(w));
    return () => observer.disconnect();
  }, []);

  let index = 0;
  return (
    <p ref={root} className="heading-2 max-w-5xl text-ink">
      {lines.map((line, lineIndex) => (
        <span key={line} className="block">
          {line.split(" ").map((word, i) => {
            const id = index++;
            return (
              <span key={`${lineIndex}-${i}`}>
                <span className="word" data-word={id} data-on={active.has(id)}>
                  {word}
                </span>{" "}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}
