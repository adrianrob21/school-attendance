import "./AttendanceFace.css";
import type { AttendanceFaceProps } from "./types";

const AttendanceFace = ({ status, className }: AttendanceFaceProps) => (
  <svg
    aria-hidden="true"
    className={["attendance-face", `attendance-face--${status}`, className]
      .filter(Boolean)
      .join(" ")}
    viewBox="0 0 28 28"
    focusable="false"
  >
    <circle className="attendance-face__background" cx="14" cy="14" r="12" />
    <path className="attendance-face__shine" d="M6.5 10.5a8.5 8.5 0 0 1 9-5" />
    {status === "unverified" ? (
      <g className="attendance-face__expression">
        <path d="M10.7 10a3.5 3.5 0 0 1 6.7 1.2c0 2.3-3.4 2.4-3.4 5" />
        <circle cx="14" cy="20" r="1" fill="currentColor" stroke="none" />
      </g>
    ) : (
      <g className="attendance-face__expression">
        <ellipse
          cx="10"
          cy="10.5"
          rx="1.1"
          ry="1.5"
          fill="currentColor"
          stroke="none"
        />
        <ellipse
          cx="18"
          cy="10.5"
          rx="1.1"
          ry="1.5"
          fill="currentColor"
          stroke="none"
        />
        <path
          d={
            status === "present"
              ? "M9 16c1.8 4 8.2 4 10 0"
              : "M9 19c1.8-4 8.2-4 10 0"
          }
        />
      </g>
    )}
  </svg>
);

export default AttendanceFace;
