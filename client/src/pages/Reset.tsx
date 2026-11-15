import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import AuthShell from "../components/AuthShell";
import Button from "../components/Button";
import PasswordField from "../components/PasswordField";
import { api, ApiError } from "../lib/api";
import { confirmError, hasErrors, newPasswordError } from "../lib/validate";

type Errors = { password?: string; confirm?: string; form?: string };

export default function Reset() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [linkBroken, setLinkBroken] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {
      password: newPasswordError(password),
      confirm: confirmError(password, confirm),
    };
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    try {
      await api("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, password }) });
      navigate("/login", {
        replace: true,
        state: { notice: "Пароль изменён. Войдите с новым паролем." },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && !err.fields.password)
        setLinkBroken(true);
      setErrors({
        password: err instanceof ApiError ? err.fields.password : undefined,
        form:
          err instanceof ApiError ? err.message : "Не удалось сменить пароль. Попробуйте ещё раз",
      });
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Новый пароль"
      subtitle="Придумайте новый пароль для входа."
      asideTitle="Почти готово"
      asideText="После смены пароля войдите заново на всех устройствах."
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {errors.form && !errors.password && <Alert tone="error">{errors.form}</Alert>}
        {linkBroken && (
          <Link
            to="/forgot"
            className="rounded-lg text-info underline underline-offset-4 transition-colors duration-300 ease-brand hover:text-ink"
          >
            Запросить новую ссылку
          </Link>
        )}
        <PasswordField
          label="Новый пароль"
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
          {loading ? "Сохраняем" : "Сохранить пароль"}
        </Button>
      </form>
    </AuthShell>
  );
}
