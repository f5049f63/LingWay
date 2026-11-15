import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import Button from "./Button";
import Logo from "./Logo";

const navItems = [
  { to: "/learn", label: "Учиться" },
  { to: "/phrasebook", label: "Разговорник" },
  { to: "/about", label: "О проекте" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className="flex size-10 items-center justify-center rounded-lg text-icon transition-colors duration-300 ease-brand hover:bg-surface-hover active:scale-[0.98]"
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
}

function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  const line =
    "absolute inset-0 m-auto h-0.5 w-5 rounded-full bg-ink transition-transform duration-500 ease-brand";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Закрыть меню" : "Открыть меню"}
      className="relative size-10 rounded-lg hover:bg-surface-hover md:hidden"
    >
      <span className={line} style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }} />
      <span className={line} style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }} />
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 body-5 transition-colors duration-300 ease-brand hover:bg-surface-hover ${
      isActive ? "bg-surface-selected text-info" : "text-muted"
    }`;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-fit items-center justify-between gap-6 mat-glass rounded-2xl p-2 max-md:max-w-full">
        <Link to="/" aria-label="LingWay, на главную" className="rounded-lg pl-1">
          <Logo />
        </Link>
        <nav aria-label="Основное" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Пока проверяем вход, место держим пустым, чтобы шапка не прыгала */}
          <div
            className={`hidden items-center gap-1 md:flex ${user === undefined ? "invisible" : ""}`}
          >
            {user ? (
              <>
                <Button to="/profile" variant="tertiary" size="sm">
                  {user.name}
                </Button>
                <Button onClick={logout} size="sm" variant="secondary">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="tertiary" size="sm">
                  Войти
                </Button>
                <Button to="/register" size="sm">
                  Регистрация
                </Button>
              </>
            )}
          </div>
          <MenuToggle open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </div>

      {/* Мобильное меню: панель на всю высоту, ссылки появляются по очереди */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 -z-10 flex flex-col justify-center gap-2 bg-overlay-strong px-6 pt-24 backdrop-blur-xl transition-opacity duration-500 ease-brand md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {[
          ...navItems,
          ...(user
            ? [{ to: "/profile", label: user.name }]
            : [
                { to: "/login", label: "Войти" },
                { to: "/register", label: "Регистрация" },
              ]),
        ].map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              `heading-4 py-2 transition-[opacity,transform] duration-500 ease-brand ${
                isActive ? "text-info" : "text-ink"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`
            }
            style={{ transitionDelay: open ? `${Math.min(i * 60, 400)}ms` : "0ms" }}
          >
            {item.label}
          </NavLink>
        ))}
        {user && (
          <button
            type="button"
            onClick={logout}
            tabIndex={open ? 0 : -1}
            className="heading-4 py-2 text-left text-muted"
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
}

function Footer() {
  const link =
    "rounded-lg body-6 text-muted transition-colors duration-300 ease-brand hover:text-ink";
  return (
    <footer className="border-t border-border bg-surface-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Logo />
          <p className="body-6 text-muted">
            Английский для поездок: фразы и диалоги для аэропорта, отеля, кафе и города.
          </p>
        </div>
        <nav aria-label="Подвал" className="flex flex-wrap gap-x-8 gap-y-3">
          <Link to="/about" className={link}>
            О проекте
          </Link>
          <Link to="/privacy" className={link}>
            Конфиденциальность
          </Link>
          <Link to="/terms" className={link}>
            Условия использования
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 caption-5 text-subtle">
          © 2026 LingWay. Учебный проект.
        </p>
      </div>
    </footer>
  );
}

export default function Layout() {
  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("content")?.focus();
  };
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        onClick={skip}
        className="sr-only rounded-lg bg-action px-3 py-2 button-sm text-on-action focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Перейти к содержимому
      </a>
      <Header />
      <main id="content" tabIndex={-1} className="flex-1 pt-24 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
