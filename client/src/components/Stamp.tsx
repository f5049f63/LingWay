import { useId } from "react";

/** Круглый паспортный штамп с текстом по окружности. Только украшение. */
export default function Stamp({
  text = "LINGWAY · BOARDING · READY · ",
  size = 160,
  className = "",
}: {
  text?: string;
  size?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M22 80 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
      </defs>
      <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="80" r="42" stroke="currentColor" strokeWidth="2" />
      <text fill="currentColor" fontSize="13" fontWeight="600">
        <textPath href={`#${id}`} textLength="356" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      <text x="80" y="89" textAnchor="middle" fill="currentColor" fontSize="26" fontWeight="700">
        LW
      </text>
    </svg>
  );
}
