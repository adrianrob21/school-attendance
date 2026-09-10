import test from "node:test";
import assert from "node:assert/strict";

import {
  getStudentAge,
  formatBirthDate,
  isValidBirthDate,
  getTodayDateInput,
  getLatestStudentBirthDateInput,
  isValidStudentBirthDate,
} from "./dates";

const today = new Date(2026, 8, 10, 0, 5);

test("ages change on the local birthday, including the start of that day", () => {
  assert.equal(getStudentAge("2021-09-09", today), 5);
  assert.equal(getStudentAge("2021-09-10", today), 5);
  assert.equal(getStudentAge("2021-09-11", today), 4);
  assert.equal(getStudentAge("2026-09-10", today), 0);
});

test("a February 29 birthday turns a year older on March 1 in a non-leap year", () => {
  assert.equal(getStudentAge("2020-02-29", new Date(2025, 1, 28, 12)), 4);
  assert.equal(getStudentAge("2020-02-29", new Date(2025, 2, 1, 12)), 5);
  assert.equal(getStudentAge("2020-02-29", new Date(2024, 1, 29, 12)), 4);
});

test("children become eligible on their second local birthday", () => {
  assert.equal(getLatestStudentBirthDateInput(today), "2024-09-10");
  assert.equal(isValidStudentBirthDate("2024-09-09", today), true);
  assert.equal(isValidStudentBirthDate("2024-09-10", today), true);
  assert.equal(isValidStudentBirthDate("2024-09-11", today), false);
  assert.equal(isValidStudentBirthDate("2026-09-10", today), false);
  assert.equal(isValidBirthDate("2026-09-10", today), true);
});

test("the minimum-age cutoff handles leap days and local year boundaries", () => {
  const leapDay = new Date(2024, 1, 29, 0, 5);
  assert.equal(getLatestStudentBirthDateInput(leapDay), "2022-02-28");
  assert.equal(isValidStudentBirthDate("2022-02-28", leapDay), true);
  assert.equal(isValidStudentBirthDate("2022-03-01", leapDay), false);
  assert.equal(
    isValidStudentBirthDate("2024-02-29", new Date(2026, 1, 28, 23, 59)),
    false,
  );
  assert.equal(
    isValidStudentBirthDate("2024-02-29", new Date(2026, 2, 1, 0, 5)),
    true,
  );
  const newYear = new Date(2026, 0, 1, 0, 5);
  assert.equal(getLatestStudentBirthDateInput(newYear), "2024-01-01");
  assert.equal(isValidStudentBirthDate("2024-01-01", newYear), true);
  assert.equal(isValidStudentBirthDate("2024-01-02", newYear), false);
});

test("invalid dates and future birthdays cannot produce an age", () => {
  for (const date of [
    "",
    "2026-09-11",
    "2025-02-29",
    "1900-02-29",
    "2021-04-31",
    "2021-00-10",
    "2021-13-10",
    "2021-01-00",
    "0000-01-01",
    "2021-9-10",
    "2021-09-10T00:00:00Z",
  ]) {
    assert.equal(isValidBirthDate(date, today), false, date);
    assert.equal(isValidStudentBirthDate(date, today), false, date);
    assert.equal(getStudentAge(date, today), null, date);
  }
  assert.equal(isValidBirthDate("2000-02-29", today), true);
});

test("display dates preserve the calendar day without parsing UTC timestamps", () => {
  assert.equal(formatBirthDate("2021-01-02"), "02.01.2021");
  assert.equal(formatBirthDate("2020-02-29"), "29.02.2020");
  assert.equal(formatBirthDate("2021-02-29"), "");
  assert.equal(getTodayDateInput(today), "2026-09-10");
  assert.equal(getTodayDateInput(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});
