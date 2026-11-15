import {
  BriefcaseIcon,
  GraduationCapIcon,
  HouseLineIcon,
  SuitcaseRollingIcon,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import ChoiceCard from "../components/ChoiceCard";
import type { User } from "../context/AuthContext";
import { destinations, levels, purposes, type Option } from "../data/onboarding";
import { useAuth } from "../hooks/useAuth";
import { api, ApiError } from "../lib/api";

type Key = "purpose" | "destination" | "level";
type Answers = Partial<Record<Key, string>>;

interface Step {
  key: Key;
  title: string;
  text: string;
  options: readonly Option[];
  lead?: (value: string) => ReactNode;
  /** Две колонки на широком экране: короткие варианты без описания */
  compact?: boolean;
}

const purposeIcons: Record<string, ReactNode> = {
  tourism: <SuitcaseRollingIcon size={24} />,
  business: <BriefcaseIcon size={24} />,
  study: <GraduationCapIcon size={24} />,
  relocation: <HouseLineIcon size={24} />,
};

const steps: Step[] = [
  {
    key: "purpose",
    title: "Зачем вы едете?",
    text: "От этого зависит, с каких ситуаций лучше начать.",
    options: purposes,
    lead: (v) => purposeIcons[v],
  },
  {
    key: "destination",
    title: "Куда направляетесь?",
    text: "Если страна ещё не выбрана, так и отметьте.",
    options: destinations,
    compact: true,
  },
  {
    key: "level",
    title: "Какой у вас уровень английского?",
    text: "Ответьте как есть. Позже ответы можно изменить в настройках.",
    options: levels,
    lead: (v) => v,
  },
];

export default function Welcome() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => ({
    purpose: user?.trip.purpose ?? undefined,
    destination: user?.trip.destination ?? undefined,
    level: user?.trip.level ?? undefined,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // При переходе на следующий шаг переводим фокус на заголовок, чтобы скринридер прочитал вопрос
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const current = steps[step];
  const last = step === steps.length - 1;
  const selected = answers[current.key];

  const save = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const r = await api<{ user: User }>("/api/account/onboarding", {
        method: "PUT",
        body: JSON.stringify(answers),
      });
      setUser(r.user);
      navigate("/learn");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось сохранить. Попробуйте ещё раз");
      setLoading(false);
    }
  };

  const skip = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const r = await api<{ user: User }>("/api/account/onboarding/skip", { method: "POST" });
      setUser(r.user);
      navigate("/learn");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось продолжить. Попробуйте ещё раз");
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="mat-raised rounded-3xl p-6 md:p-12">
        <div aria-live="polite">
          <p className="caption-1 text-muted">
            Шаг {step + 1} из {steps.length}
          </p>
        </div>
        <div className="mt-3 flex gap-2" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={s.key}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ease-brand ${
                i <= step ? "bg-action" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div key={step} className="bubble-in mt-8">
          <h1 id={headingId} ref={headingRef} tabIndex={-1} className="heading-4 text-ink">
            {current.title}
          </h1>
          <p className="body-3 mt-2 text-muted">{current.text}</p>

          <div
            role="radiogroup"
            aria-labelledby={headingId}
            className={`mt-8 grid gap-3 ${current.compact ? "sm:grid-cols-2" : ""}`}
          >
            {current.options.map((o) => (
              <ChoiceCard
                key={o.value}
                name={current.key}
                value={o.value}
                title={o.title}
                text={o.text}
                lead={current.lead?.(o.value)}
                checked={selected === o.value}
                onChange={(v) => setAnswers((a) => ({ ...a, [current.key]: v }))}
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="secondary" disabled={loading} onClick={() => setStep(step - 1)}>
                Назад
              </Button>
            )}
            {!user?.onboarded && (
              <Button variant="tertiary" disabled={loading} onClick={skip}>
                Пропустить
              </Button>
            )}
          </div>
          <Button disabled={!selected || loading} onClick={last ? save : () => setStep(step + 1)}>
            {loading ? "Сохраняем" : last ? "Готово" : "Дальше"}
          </Button>
        </div>
      </div>
    </section>
  );
}
