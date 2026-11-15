import { EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Field from "../components/Field";
import Stamp from "../components/Stamp";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";

type Errors = { email?: string; password?: string; form?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) errors.email = "Введите email";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Введите корректный email";
  if (!password) errors.password = "Введите пароль";
  return errors;
}

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/learn";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(email, password);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({
          email: err.fields.email,
          password: err.fields.password,
          form: err.fields.email || err.fields.password ? undefined : err.message,
        });
      } else {
        setErrors({ form: "Не удалось выполнить вход. Попробуйте ещё раз" });
      }
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl items-stretch gap-6 px-4 py-12 lg:grid-cols-2">
      <div className="mat-raised flex flex-col justify-center rounded-3xl p-6 md:p-12">
        <h1 className="heading-4 text-ink">Вход</h1>
        <p className="body-3 mt-2 text-muted">
          Войдите, чтобы продолжить с того места, где остановились.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-6">
          {errors.form && (
            <div
              role="alert"
              className="body-5 flex items-start gap-3 rounded-lg border border-border-error bg-surface-error p-3 text-error"
            >
              <WarningCircleIcon size={20} className="shrink-0" aria-hidden="true" />
              {errors.form}
            </div>
          )}

          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={loading}
          />

          <Field
            label="Пароль"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={loading}
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

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "Входим" : "Войти"}
          </Button>
        </form>

        <p className="body-6 mt-6 text-muted">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="rounded-lg text-info underline underline-offset-4 transition-colors duration-300 ease-brand hover:text-ink"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>

      {/* Правая часть: диалог из урока, только на широких экранах */}
      <aside
        className="mat-action relative hidden flex-col justify-between gap-12 overflow-hidden rounded-3xl p-12 text-on-action lg:flex"
        aria-hidden="true"
      >
        <Stamp size={240} className="absolute -right-12 -top-12 text-on-action opacity-20" />
        <div className="relative">
          <p className="heading-3 max-w-xs">Продолжите маршрут</p>
          <p className="body-3 mt-4 max-w-xs opacity-90">
            Фразы, диалоги и повторение ждут вас там, где вы остановились.
          </p>
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="mat-raised max-w-[80%] self-start rounded-xl px-4 py-3 text-ink">
            <p className="body-2">Where are you flying today?</p>
            <p className="caption-5 mt-1 text-muted">Куда вы летите сегодня?</p>
          </div>
          <div className="max-w-[80%] self-end rounded-xl bg-surface-inverted px-4 py-3 text-inverted">
            <p className="body-2">I&apos;m flying to Lisbon.</p>
            <p className="caption-5 mt-1 opacity-80">Я лечу в Лиссабон.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
