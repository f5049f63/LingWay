import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Тема хранится классом `dark` на <html>. Начальное значение ставит скрипт в index.html. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // хранилище может быть недоступно, тогда тема живёт до перезагрузки
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
