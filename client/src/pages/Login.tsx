import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { emailError, hasErrors } from "../lib/validate";

type Errors = { email?: string; password?: string; form?: string };

const linkClass =
  "rounded-lg text-info underline underline-offset-4 transition-colors duration-300 ease-brand hover:text-ink";

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {
      email: emailError(email),
      password: password ? undefined : "Введите пароль",
    };
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    try {
      // После входа GuestOnly сам перенаправит на нужную страницу
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
    <AuthShell title="Вход" subtitle="Войдите, чтобы продолжить с того места, где остановились.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {notice && !errors.form && <Alert tone="success">{notice}</Alert>}
        {errors.form && <Alert tone="error">{errors.form}</Alert>}

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

        <div className="flex flex-col gap-2">
          <PasswordField
            label="Пароль"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={loading}
          />
          <Link to="/forgot" className={`${linkClass} body-6 self-start`}>
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Входим" : "Войти"}
        </Button>
      </form>

      <p className="body-6 mt-6 text-muted">
        Нет аккаунта?{" "}
        <Link to="/register" className={linkClass}>
          Зарегистрироваться
        </Link>
      </p>
    </AuthShell>
  );
}
