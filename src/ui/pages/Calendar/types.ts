import type { Student } from "../../../process/students/types";

export type CalendarSeason = "winter" | "spring" | "summer" | "autumn";

export type CalendarHoliday = "valentine" | "halloween" | "christmas";

export interface CalendarTheme {
  key: string;
  labelKey: string;
  season: CalendarSeason;
  accent: string;
  /** Zero-based month tile in the four-column, four-row seasonal marker atlas. */
  atlasIndex: number;
  motif: string;
}

export interface CalendarDayPosition {
  day: number;
  /** SVG viewBox coordinates. Divide by layout width/height for CSS percentages. */
  x: number;
  y: number;
}

export interface CalendarLayout {
  width: number;
  height: number;
  /** Always chronological, including when a visual row runs right to left. */
  days: CalendarDayPosition[];
  path: string;
}

export type CalendarBirthdays = Map<number, Student[]>;
