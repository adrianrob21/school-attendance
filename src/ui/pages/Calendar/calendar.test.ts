import test from "node:test";
import assert from "node:assert/strict";

import {
  getDateKey,
  getHoliday,
  shiftMonth,
  MONTH_THEMES,
  parseDateKey,
  getLocalToday,
  getDaysInMonth,
  getCalendarLayout,
  createCalendarDate,
  getBirthdaysForMonth,
} from "./calendar";
import type { Student } from "../../../process/students/types";

const student = (id: string, dateOfBirth: string): Student => ({
  id,
  fullName: `Student ${id}`,
  dateOfBirth,
});

const groupRows = (days: ReturnType<typeof getCalendarLayout>["days"]) => {
  const rows = new Map<number, typeof days>();
  for (const day of days) {
    rows.set(day.y, [...(rows.get(day.y) ?? []), day]);
  }
  return [...rows.values()];
};

test("all months have their actual day counts, including century leap-year rules", () => {
  assert.deepEqual(
    Array.from({ length: 12 }, (_, month) => getDaysInMonth(2026, month)),
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  );
  assert.equal(getDaysInMonth(2024, 1), 29);
  assert.equal(getDaysInMonth(1900, 1), 28);
  assert.equal(getDaysInMonth(2000, 1), 29);
  assert.equal(getDaysInMonth(2100, 1), 28);
});

test("month navigation crosses years and never skips February from January 31", () => {
  assert.equal(
    getDateKey(shiftMonth(createCalendarDate(2026, 0, 31), 1)),
    "2026-02-01",
  );
  assert.equal(
    getDateKey(shiftMonth(createCalendarDate(2026, 0), -1)),
    "2025-12-01",
  );
  assert.equal(
    getDateKey(shiftMonth(createCalendarDate(2026, 11), 1)),
    "2027-01-01",
  );
  assert.equal(
    getDateKey(shiftMonth(createCalendarDate(2026, 8), 12)),
    "2027-09-01",
  );
});

test("date-only parsing preserves local calendar days, including years below 100", () => {
  for (const key of [
    "2026-01-01",
    "2026-03-29",
    "2026-10-25",
    "2024-02-29",
    "0099-01-02",
  ]) {
    const date = parseDateKey(key);
    assert.ok(date, key);
    assert.equal(getDateKey(date), key);
    assert.equal(date.getHours(), 12);
  }

  const now = new Date(2026, 8, 10, 0, 1);
  const today = getLocalToday(now);
  assert.equal(getDateKey(today), "2026-09-10");
  assert.equal(today.getHours(), 12);
  assert.equal(now.getHours(), 0, "does not mutate the caller's date");
});

test("malformed, impossible, and timestamp date keys are rejected", () => {
  for (const key of [
    "",
    "0000-01-01",
    "2026-2-01",
    "2026-02-29",
    "1900-02-29",
    "2026-04-31",
    "2026-00-01",
    "2026-13-01",
    "2026-01-00",
    "2026-01-32",
    "2026-01-01T00:00:00Z",
    " 2026-01-01",
  ]) {
    assert.equal(parseDateKey(key), null, key);
  }
});

test("birthday groups retain real students and shared birthdays without inventing dates", () => {
  const students = [
    student("later", "2020-09-22"),
    student("first", "2021-09-08"),
    student("second", "2022-09-08"),
    student("other-month", "2022-08-08"),
    student("not-born-yet", "2027-09-08"),
    student("invalid", "2021-09-31"),
  ];
  const birthdays = getBirthdaysForMonth(students, 2026, 8);
  assert.deepEqual([...birthdays.keys()], [8, 22]);
  assert.deepEqual(birthdays.get(8), [students[1], students[2]]);
  assert.equal(birthdays.get(22)?.[0], students[0]);
  assert.equal(getBirthdaysForMonth([], 2026, 8).size, 0);
  assert.equal(getBirthdaysForMonth(students, 2019, 8).size, 0);
});

test("February 29 birthdays appear on leap day only and never move to another day", () => {
  const leapBirthday = student("leap", "2020-02-29");
  assert.deepEqual(getBirthdaysForMonth([leapBirthday], 2024, 1).get(29), [
    leapBirthday,
  ]);
  assert.equal(getBirthdaysForMonth([leapBirthday], 2025, 1).size, 0);
  assert.equal(getBirthdaysForMonth([leapBirthday], 2025, 2).size, 0);
  assert.equal(getBirthdaysForMonth([leapBirthday], 2016, 1).size, 0);
});

test("the three holiday highlights appear on their exact calendar dates", () => {
  assert.equal(getHoliday(1, 14), "valentine");
  assert.equal(getHoliday(9, 31), "halloween");
  assert.equal(getHoliday(11, 25), "christmas");
  assert.equal(getHoliday(1, 13), null);
  assert.equal(getHoliday(9, 30), null);
  assert.equal(getHoliday(11, 24), null);
  assert.equal(getHoliday(11, 31), null);
  assert.equal(getHoliday(5, 14), null);
});

test("every seasonal theme maps to its January-to-December atlas tile", () => {
  assert.equal(MONTH_THEMES.length, 12);
  assert.equal(new Set(MONTH_THEMES.map(({ key }) => key)).size, 12);
  assert.deepEqual(
    MONTH_THEMES.map(({ atlasIndex }) => atlasIndex),
    Array.from({ length: 12 }, (_, index) => index),
  );
});

test("desktop trail retains five chronological sweeps through every month's final date", () => {
  for (const count of [28, 29, 30, 31]) {
    const layout = getCalendarLayout(count);
    assert.deepEqual(
      layout.days.map(({ day }) => day),
      Array.from({ length: count }, (_, index) => index + 1),
    );
    const rows = groupRows(layout.days);
    assert.deepEqual(
      rows.map((days) => days.length),
      [6, 6, 6, 6, count - 24],
    );
    rows.forEach((days, row) => {
      for (let index = 1; index < days.length; index++) {
        assert.equal(days[index].x > days[index - 1].x, row % 2 === 0);
      }
    });
    assert.equal(layout.days.at(-1)?.day, count);
  }
});

test("compact trail keeps four stops per row within eight rows and consistent chronology", () => {
  for (const count of [28, 29, 30, 31]) {
    const layout = getCalendarLayout(count, true);
    const rows = groupRows(layout.days);
    assert.equal(rows.length, Math.ceil(count / 4));
    assert.ok(rows.length <= 8);
    assert.equal(layout.width, 360);
    assert.equal(layout.height, rows.length * 80);
    assert.deepEqual(
      layout.days.map(({ day }) => day),
      Array.from({ length: count }, (_, index) => index + 1),
    );
    rows.forEach((days, row) => {
      assert.ok(days.length <= 4);
      assert.equal(days[0].y, 40 + row * 80);
      for (const { x } of days) {
        assert.ok([45, 135, 225, 315].includes(x));
      }
      for (let index = 1; index < days.length; index++) {
        assert.equal(days[index].x > days[index - 1].x, row % 2 === 0);
        assert.equal(Math.abs(days[index].x - days[index - 1].x), 90);
      }
    });
  }
});

test("SVG path visits every date center without gaps and stays inside the viewBox", () => {
  for (const compact of [false, true]) {
    const layout = getCalendarLayout(31, compact);
    const commands = [...layout.path.matchAll(/([MC]) ([\d., -]+)/g)];
    assert.equal(commands.length, 31);
    commands.forEach(([, command, values], index) => {
      const points = values.trim().split(/[ ,]+/).map(Number);
      assert.equal(command, index === 0 ? "M" : "C");
      assert.deepEqual(points.slice(-2), [
        layout.days[index].x,
        layout.days[index].y,
      ]);
      for (let point = 0; point < points.length; point += 2) {
        assert.ok(points[point] >= 0 && points[point] <= layout.width);
        assert.ok(points[point + 1] >= 0 && points[point + 1] <= layout.height);
      }
    });
    assert.deepEqual(
      getCalendarLayout(31, compact),
      layout,
      "layout is deterministic",
    );
  }
});

test("layout rejects invalid date counts instead of creating an incomplete calendar", () => {
  for (const dayCount of [0, 27, 32, 30.5, Number.NaN]) {
    assert.throws(() => getCalendarLayout(dayCount), RangeError);
  }
});
