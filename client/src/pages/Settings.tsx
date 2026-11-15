import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import { destinations, purposes, titleOf } from "../data/onboarding";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import { confirmError, emailError, hasErrors, nameError, newPasswordError } from "../lib/validate";

function Section({
  title,
  text,
  danger,
  children,
}: {
  title: string;
  text?: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-3xl p-6 md:p-8 ${danger ? "border border-border-error bg-surface" : "mat-raised"}`}
    >
      <h2 className={`heading-6 ${danger ? "text-error" : "text-ink"}`}>{title}</h2>
      {text && <p className="body-6 mt-2 max-w-md text-muted">{text}</p>}
      <div className="mt-6 max-w-md">{children}</div>
    </section>
  );
}

/** Общая часть форм: состояние отправки, ошибка и сообщение об успехе */
function useForm() {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [done, setDone] = useState<string>();
  return { loading, setLoading, formError, setFormError, done, setDone };
}

const generic = "Не удалось сохранить. Попробуйте ещё раз";

function ProfileForm() {
  const { user, setUser } = useAuth();
  const form = useForm();
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState<string>();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setDone(undefined);
    form.setFormError(undefined);
    const found = nameError(name);
    setError(found);
    if (found) return;

    form.setLoading(true);
    try {
      const r = await api<{ user: User }>("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });
      setUser(r.user);
      setName(r.user.name);
      form.setDone("Имя сохранено");
    } catch (err) {
      if (err instanceof ApiError && err.fields.name) setError(err.fields.name);
      else form.setFormError(err instanceof ApiError ? err.message : generic);
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <Section title="Имя">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {form.formError && <Alert tone="error">{form.formError}</Alert>}
        {form.done && <Alert tone="success">{form.done}</Alert>}
        <Field
          label="Имя"
          name="name"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          disabled={form.loading}
        />
        <Button
          type="submit"
          disabled={form.loading || name.trim() === user?.name}
          className="self-start"
        >
          {form.loading ? "Сохраняем" : "Сохранить"}
        </Button>
      </form>
    </Section>
  );
}

/** Ответы онбординга: показываем и ведём на страницу, где их можно изменить */
function TripSection() {
  const { user } = useAuth();
  const trip = user?.trip;
  const facts = [
    titleOf(purposes, trip?.purpose ?? null) && `Цель: ${titleOf(purposes, trip?.purpose ?? null)}`,
    titleOf(destinations, trip?.destination ?? null) &&
      `Страна: ${titleOf(destinations, trip?.destination ?? null)}`,
    trip?.level && `Уровень: ${trip.level}`,
  ].filter(Boolean);

  return (
    <Section
      title="Маршрут"
      text={
        facts.length > 0
          ? facts.join(". ") + "."
          : "Ответов пока нет. Пройдите короткий опрос, и мы расставим ситуации под вашу поездку."
      }
    >
      <Button to="/welcome" variant="secondary">
        {facts.length > 0 ? "Изменить ответы" : "Пройти опрос"}
      </Button>
    </Section>
  );
}

function EmailForm() {
  const { user, setUser } = useAuth();
  const form = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setDone(undefined);
    form.setFormError(undefined);
    const found = {
      email: emailError(email),
      password: password ? undefined : "Введите пароль",
    };
    setErrors(found);
    if (hasErrors(found)) return;

    form.setLoading(true);
    try {
      const r = await api<{ user: User }>("/api/account/email", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setUser(r.user);
      setEmail("");
      setPassword("");
      form.setDone("Email изменён");
    } catch (err) {
      if (err instanceof ApiError && (err.fields.email || err.fields.password)) {
        setErrors({ email: err.fields.email, password: err.fields.password });
      } else {
        form.setFormError(err instanceof ApiError ? err.message : generic);
      }
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <Section title="Email" text={`Сейчас: ${user?.email}. Для смены нужен текущий пароль.`}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {form.formError && <Alert tone="error">{form.formError}</Alert>}
        {form.done && <Alert tone="success">{form.done}</Alert>}
        <Field
          label="Новый email"
          name="new-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={form.loading}
        />
        <PasswordField
          label="Текущий пароль"
          name="email-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={form.loading}
        />
        <Button type="submit" disabled={form.loading} className="self-start">
          {form.loading ? "Сохраняем" : "Изменить email"}
        </Button>
      </form>
    </Section>
  );
}

function PasswordForm() {
  const form = useForm();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setDone(undefined);
    form.setFormError(undefined);
    const found = {
      current: current ? undefined : "Введите текущий пароль",
      next: newPasswordError(next),
      confirm: confirmError(next, confirm),
    };
    setErrors(found);
    if (hasErrors(found)) return;

    form.setLoading(true);
    try {
      await api("/api/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      form.setDone("Пароль изменён. На других устройствах нужно будет войти заново");
    } catch (err) {
      if (err instanceof ApiError && (err.fields.currentPassword || err.fields.newPassword)) {
        setErrors({ current: err.fields.currentPassword, next: err.fields.newPassword });
      } else {
        form.setFormError(err instanceof ApiError ? err.message : generic);
      }
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <Section title="Пароль">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        {form.formError && <Alert tone="error">{form.formError}</Alert>}
        {form.done && <Alert tone="success">{form.done}</Alert>}
        <PasswordField
          label="Текущий пароль"
          name="current-password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          error={errors.current}
          disabled={form.loading}
        />
        <PasswordField
          label="Новый пароль"
          name="new-password"
          autoComplete="new-password"
          hint="Не короче 8 символов"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          error={errors.next}
          disabled={form.loading}
        />
        <PasswordField
          label="Повторите новый пароль"
          name="confirm-password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          disabled={form.loading}
        />
        <Button type="submit" disabled={form.loading} className="self-start">
          {form.loading ? "Сохраняем" : "Изменить пароль"}
        </Button>
      </form>
    </Section>
  );
}

function DeleteAccount() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.setFormError(undefined);
    if (!password) {
      setError("Введите пароль");
      return;
    }
    setError(undefined);

    form.setLoading(true);
    try {
      await api("/api/account", { method: "DELETE", body: JSON.stringify({ password }) });
      // Сначала уходим со страницы, иначе защита перекинет на вход
      navigate("/", { replace: true });
      setUser(null);
    } catch (err) {
      if (err instanceof ApiError && err.fields.password) setError(err.fields.password);
      else
        form.setFormError(
          err instanceof ApiError ? err.message : "Не удалось удалить аккаунт. Попробуйте ещё раз",
        );
      form.setLoading(false);
    }
  };

  return (
    <Section
      danger
      title="Удаление аккаунта"
      text="Аккаунт и весь прогресс будут удалены без возможности восстановления."
    >
      {open ? (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {form.formError && <Alert tone="error">{form.formError}</Alert>}
          <PasswordField
            label="Введите пароль для подтверждения"
            name="delete-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            disabled={form.loading}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="danger" disabled={form.loading}>
              {form.loading ? "Удаляем" : "Удалить навсегда"}
            </Button>
            <Button
              variant="tertiary"
              disabled={form.loading}
              onClick={() => {
                setOpen(false);
                setPassword("");
                setError(undefined);
                form.setFormError(undefined);
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="danger" onClick={() => setOpen(true)}>
          Удалить аккаунт
        </Button>
      )}
    </Section>
  );
}

export default function Settings() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <header>
        <h1 className="heading-3 text-ink">Настройки</h1>
        <p className="body-3 mt-2 text-muted">Данные аккаунта и безопасность.</p>
      </header>
      <ProfileForm />
      <TripSection />
      <EmailForm />
      <PasswordForm />
      <DeleteAccount />
    </div>
  );
}
