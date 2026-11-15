import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Сообщение над формой. Ошибка озвучивается сразу, успех спокойно. */
export default function Alert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const error = tone === "error";
  const Icon = error ? WarningCircleIcon : CheckCircleIcon;
  return (
    <div
      role={error ? "alert" : "status"}
      className={`body-5 flex items-start gap-3 rounded-lg border p-3 ${
        error
          ? "border-border-error bg-surface-error text-error"
          : "border-border-success bg-surface-success text-success"
      }`}
    >
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
