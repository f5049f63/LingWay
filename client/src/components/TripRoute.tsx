import { ArrowRightIcon } from "@phosphor-icons/react";
import type { Ref } from "react";
import { Link } from "react-router-dom";
import { destinations, purposes, titleOf } from "../data/onboarding";
import { routeFor } from "../data/route";
import type { Trip } from "../context/AuthContext";
import Button from "./Button";
import SituationIcon from "./SituationIcon";

interface Props {
  trip: Trip;
  onEdit: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
}

/** Маршрут под ответы онбординга: ситуации в том порядке, в каком они понадобятся в поездке */
export default function TripRoute({ trip, onEdit, headingRef }: Props) {
  const route = routeFor(trip.purpose);
  const first = route[0];
  const facts = [
    titleOf(purposes, trip.purpose),
    titleOf(destinations, trip.destination),
    trip.level && `Уровень ${trip.level}`,
  ].filter(Boolean);

  return (
    <div className="mat-raised rounded-3xl p-6 md:p-12">
      <h1 ref={headingRef} tabIndex={-1} className="heading-4 text-ink">
        Ваш маршрут
      </h1>
      <p className="body-3 mt-2 text-muted">
        Ситуации расставлены в том порядке, в каком они понадобятся в поездке.
      </p>

      {facts.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ваши ответы">
          {facts.map((f) => (
            <li key={String(f)} className="mat-sunken caption-1 rounded-lg px-3 py-1 text-ink">
              {f}
            </li>
          ))}
        </ul>
      )}

      <ol className="mt-8 flex flex-col gap-3">
        {route.map((s, i) => (
          <li key={s.slug}>
            <Link
              to={`/situation/${s.slug}`}
              className={`mat-raised lift flex items-center gap-4 rounded-xl p-4 transition-colors duration-300 ease-brand hover:bg-surface-hover ${
                i === 0 ? "border-border-action bg-surface-selected" : ""
              }`}
            >
              <span className="title-4 w-6 shrink-0 text-center text-subtle" aria-hidden="true">
                {i + 1}
              </span>
              <SituationIcon name={s.icon} onSelected={i === 0} />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="body-2 text-ink">{s.title}</span>
                <span className="caption-2 text-muted">{s.description}</span>
                {i === 0 && <span className="caption-3 text-info">Начните отсюда</span>}
              </span>
              <ArrowRightIcon size={20} className="shrink-0 text-icon-subtle" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={onEdit}>
          Изменить ответы
        </Button>
        <Button to={`/situation/${first.slug}`}>Начать: {first.title}</Button>
      </div>
    </div>
  );
}
