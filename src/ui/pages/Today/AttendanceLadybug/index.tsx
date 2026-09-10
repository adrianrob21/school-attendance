import { useId } from "react";

import "./AttendanceLadybug.css";
import type { AttendanceLadybugProps } from "./types";

const AttendanceLadybug = ({ status, className }: AttendanceLadybugProps) => {
  const expressionId = useId();

  return (
    <svg
      aria-hidden="true"
      className={[
        "attendance-ladybug",
        `attendance-ladybug--${status}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      viewBox="40 125 1190 990"
      focusable="false"
    >
      <image href="/assets/mascots/ladybug.png" width="1254" height="1254" />
      {status !== "present" && (
        <>
          <defs>
            <radialGradient
              id={`${expressionId}-cream`}
              cx="45%"
              cy="25%"
              r="80%"
            >
              <stop offset="0" stopColor="#ffebce" />
              <stop offset="0.72" stopColor="#ffe6c8" />
              <stop offset="1" stopColor="#ffe1c3" />
            </radialGradient>
            <filter
              id={`${expressionId}-soft-edge`}
              x="-25%"
              y="-30%"
              width="150%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <ellipse
            cx="945"
            cy="711"
            rx="77"
            ry="60"
            fill={`url(#${expressionId}-cream)`}
            filter={`url(#${expressionId}-soft-edge)`}
          />
          <path
            className="attendance-ladybug__mouth"
            d={
              status === "absent"
                ? "M911 741c11-44 58-57 81-21"
                : "M925 733c11-15 30-17 44-8"
            }
          />
          {status === "unverified" && (
            <>
              <path
                className="attendance-ladybug__eyebrow"
                d="M752 594c19-20 44-27 65-17"
              />
              <g className="attendance-ladybug__question">
                <path d="M1106 352c-3-52 73-72 94-24 22 49-42 60-33 104" />
                <circle
                  cx="1172"
                  cy="472"
                  r="13"
                  fill="currentColor"
                  stroke="none"
                />
              </g>
            </>
          )}
        </>
      )}
    </svg>
  );
};

export default AttendanceLadybug;
