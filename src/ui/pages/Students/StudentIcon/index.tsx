import type { StudentIconProps } from "./types";

const paths = {
  plus: "M12 5v14M5 12h14",
  search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  "arrow-left": "m13 5-7 7 7 7M6 12h14",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  edit: "m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Z",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  camera: "M3 6h4l2-3h6l2 3h4v15H3V6ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  close: "m6 6 12 12M6 18 18 6",
  check: "m4 12 5 5L20 6",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
  flower:
    "M12 8C4-3 0 10 8 12c-11 8 2 12 4 4 8 11 12-2 4-4 11-8-2-12-4-4ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
};

const StudentIcon = ({ name, className }: StudentIconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height="20"
    width="20"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={name === "more" ? 3.5 : 1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={paths[name]} />
  </svg>
);

export default StudentIcon;
