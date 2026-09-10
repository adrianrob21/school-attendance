import type {
  CalendarTheme,
  CalendarLayout,
  CalendarHoliday,
  CalendarBirthdays,
  CalendarDayPosition,
} from "./types";
import type { Student } from "../../../process/students/types";

/** Month indexes follow Date.getMonth(): January is 0 and December is 11. */
export const MONTH_THEMES: readonly CalendarTheme[] = [
  {
    key: "january",
    labelKey: "calendar.months.january",
    season: "winter",
    accent: "#779fba",
    atlasIndex: 0,
    motif: "snowflakes and snowdrops",
  },
  {
    key: "february",
    labelKey: "calendar.months.february",
    season: "winter",
    accent: "#bc6c7e",
    atlasIndex: 1,
    motif: "heart blossoms",
  },
  {
    key: "march",
    labelKey: "calendar.months.march",
    season: "spring",
    accent: "#967dab",
    atlasIndex: 2,
    motif: "crocuses and spring shoots",
  },
  {
    key: "april",
    labelKey: "calendar.months.april",
    season: "spring",
    accent: "#c77f91",
    atlasIndex: 3,
    motif: "tulips and raindrops",
  },
  {
    key: "may",
    labelKey: "calendar.months.may",
    season: "spring",
    accent: "#c48491",
    atlasIndex: 4,
    motif: "peonies and daisies",
  },
  {
    key: "june",
    labelKey: "calendar.months.june",
    season: "summer",
    accent: "#99a571",
    atlasIndex: 5,
    motif: "daisies and buttercups",
  },
  {
    key: "july",
    labelKey: "calendar.months.july",
    season: "summer",
    accent: "#c4a044",
    atlasIndex: 6,
    motif: "sunflowers",
  },
  {
    key: "august",
    labelKey: "calendar.months.august",
    season: "summer",
    accent: "#c87959",
    atlasIndex: 7,
    motif: "poppies and golden blooms",
  },
  {
    key: "september",
    labelKey: "calendar.months.september",
    season: "autumn",
    accent: "#ab775e",
    atlasIndex: 8,
    motif: "apples and asters",
  },
  {
    key: "october",
    labelKey: "calendar.months.october",
    season: "autumn",
    accent: "#ba7946",
    atlasIndex: 9,
    motif: "pumpkins and amber leaves",
  },
  {
    key: "november",
    labelKey: "calendar.months.november",
    season: "autumn",
    accent: "#a28263",
    atlasIndex: 10,
    motif: "acorns and mushrooms",
  },
  {
    key: "december",
    labelKey: "calendar.months.december",
    season: "winter",
    accent: "#7a987c",
    atlasIndex: 11,
    motif: "baubles and evergreen wreaths",
  },
];

/** Local noon avoids midnight time changes and supports years below 100. */
export const createCalendarDate = (
  year: number,
  monthIndex: number,
  day = 1,
): Date => {
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, monthIndex, day);
  return date;
};

export const getLocalToday = (now = new Date()): Date =>
  createCalendarDate(now.getFullYear(), now.getMonth(), now.getDate());

export const getDateKey = (date: Date): string =>
  `${String(date.getFullYear()).padStart(4, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Parse a date-only key locally; never let UTC parsing shift the visible day. */
export const parseDateKey = (value: string): Date | null => {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) return null;
  const year = Number(parts[1]);
  const monthIndex = Number(parts[2]) - 1;
  const day = Number(parts[3]);
  if (year < 1 || monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) {
    return null;
  }

  const date = createCalendarDate(year, monthIndex, day);
  return date.getFullYear() === year &&
    date.getMonth() === monthIndex &&
    date.getDate() === day
    ? date
    : null;
};

export const getDaysInMonth = (year: number, monthIndex: number): number =>
  createCalendarDate(year, monthIndex + 1, 0).getDate();

/** Always start the destination month on day 1, avoiding month-end overflow. */
export const shiftMonth = (date: Date, offset: number): Date =>
  createCalendarDate(date.getFullYear(), date.getMonth() + offset);

export const getBirthdaysForMonth = (
  students: readonly Student[],
  year: number,
  monthIndex: number,
): CalendarBirthdays => {
  const birthdays: CalendarBirthdays = new Map();
  const lastDay = getDaysInMonth(year, monthIndex);

  for (const student of students) {
    const birthDate = parseDateKey(student.dateOfBirth);
    if (
      !birthDate ||
      birthDate.getFullYear() > year ||
      birthDate.getMonth() !== monthIndex ||
      birthDate.getDate() > lastDay
    ) {
      continue;
    }

    const day = birthDate.getDate();
    const dayBirthdays = birthdays.get(day) ?? [];
    dayBirthdays.push(student);
    birthdays.set(day, dayBirthdays);
  }

  return new Map(
    [...birthdays.entries()].sort(([left], [right]) => left - right),
  );
};

export const getHoliday = (
  monthIndex: number,
  day: number,
): CalendarHoliday | null => {
  if (monthIndex === 1 && day === 14) return "valentine";
  if (monthIndex === 9 && day === 31) return "halloween";
  if (monthIndex === 11 && day === 25) return "christmas";
  return null;
};

/**
 * Desktop has five sweeps, with seven stops in the final sweep for a 31-day
 * month. Compact layouts keep four targets per sweep, using at most eight rows.
 * Side margins
 * and row spacing leave room for today's mascot and birthday badges.
 */
export const getCalendarLayout = (
  dayCount: number,
  compact = false,
): CalendarLayout => {
  if (!Number.isInteger(dayCount) || dayCount < 28 || dayCount > 31) {
    throw new RangeError("A calendar month must contain 28 to 31 days.");
  }

  const width = compact ? 360 : 1200;
  const rows = compact ? Math.ceil(dayCount / 4) : 5;
  const rowSpacing = compact ? 80 : 130;
  const top = compact ? 40 : 90;
  const margin = compact ? 45 : 120;
  const height = compact ? (rows - 1) * rowSpacing + top * 2 : 700;
  const days: CalendarDayPosition[] = [];

  for (let index = 0; index < dayCount; index++) {
    const row = compact
      ? Math.floor(index / 4)
      : Math.min(4, Math.floor(index / 6));
    const column = compact ? index % 4 : index - row * 6;
    const columns = compact ? 4 : row === 4 ? Math.max(6, dayCount - 24) : 6;
    const step = (width - margin * 2) / (columns - 1);
    const x =
      row % 2 === 0 ? margin + column * step : width - margin - column * step;
    days.push({ day: index + 1, x, y: top + row * rowSpacing });
  }

  let path = `M ${days[0].x} ${days[0].y}`;
  for (let index = 1; index < days.length; index++) {
    const previous = days[index - 1];
    const current = days[index];
    if (previous.y !== current.y) {
      const bend = (previous.x > width / 2 ? 1 : -1) * (compact ? 32 : 100);
      path += ` C ${previous.x + bend} ${previous.y}, ${current.x + bend} ${current.y}, ${current.x} ${current.y}`;
    } else {
      const step = (current.x - previous.x) / 3;
      path += ` C ${previous.x + step} ${previous.y - 9}, ${current.x - step} ${current.y + 9}, ${current.x} ${current.y}`;
    }
  }

  return { width, height, days, path };
};
