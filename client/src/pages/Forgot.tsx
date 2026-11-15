import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import Field from "../components/Field";
import { api, ApiError } from "../lib/api";
import { emailError } from "../lib/validate";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = emailError(email);
    setError(found);
    setFormError(undefined);
    if (found) return;

    setLoading(true);
    try {
      await api("/api/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setSent(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Не удалось отправить запрос. Попробуйте ещё раз",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Восстановление пароля"
      subtitle="Укажите email аккаунта, и мы пришлём ссылку для нового пароля."
      asideTitle="Всё на месте"
      asideText="Прогресс и слова сохранятся, нужно только задать новый пароль."
    >
      {sent ? (
        <div className="flex flex-col gap-6">
          <span className="flex size-12 items-center justify-center rounded-lg bg-surface-selected text-info">
            <EnvelopeSimpleIcon size={24} aria-hidden="true" />
          </span>
          <div role="status" className="flex flex-col gap-2">
            <p className="title-1 text-ink">Проверьте почту</p>
            <p className="body-3 text-muted">
              Если аккаунт с адресом {email.trim()} есть, мы отправили на него письмо со ссылкой.
              Ссылка действует 1 час. Если письма нет, загляните в спам.
            </p>
          </div>
          <Button to="/login" variant="secondary" size="lg">
            Вернуться ко входу
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            {formError && <Alert tone="error">{formError}</Alert>}
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              disabled={loading}
            />
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? "Отправляем" : "Отправить ссылку"}
            </Button>
          </form>
          <p className="body-6 mt-6 text-muted">
            Вспомнили пароль?{" "}
            <Link
              to="/login"
              className="rounded-lg text-info underline underline-offset-4 transition-colors duration-300 ease-brand hover:text-ink"
            >
              Войти
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
