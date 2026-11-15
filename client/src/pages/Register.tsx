import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { confirmError, emailError, hasErrors, nameError, newPasswordError } from "../lib/validate";

type Errors = { name?: string; email?: string; password?: string; confirm?: string; form?: string };

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {
      name: nameError(name),
      email: emailError(email),
      password: newPasswordError(password),
      confirm: confirmError(password, confirm),
    };
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    try {
      // После регистрации GuestOnly сам перенаправит в приложение
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError) {
        const { name, email, password } = err.fields;
        setErrors({
          name,
          email,
          password,
          form: name || email || password ? undefined : err.message,
        });
      } else {
        setErrors({ form: "Не удалось зарегистрироваться. Попробуйте ещё раз" });
      }
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы сохранять прогресс и возвращаться к повторению."
      asideTitle="Начните маршрут"
      asideText="Выберите первую ситуацию и пройдите короткий урок."
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {errors.form && <Alert tone="error">{errors.form}</Alert>}

        <Field
          label="Имя"
          name="name"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
        />
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
        <PasswordField
          label="Пароль"
          name="password"
          autoComplete="new-password"
          hint="Не короче 8 символов"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
        <PasswordField
          label="Повторите пароль"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          disabled={loading}
        />

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Создаём аккаунт" : "Зарегистрироваться"}
        </Button>
      </form>

      <p className="body-6 mt-6 text-muted">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="rounded-lg text-info underline underline-offset-4 transition-colors duration-300 ease-brand hover:text-ink"
        >
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
