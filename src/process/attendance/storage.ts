import { get, update } from "idb-keyval";

import type { AttendanceRecord, AttendanceStatuses } from "./types";

const STORAGE_VERSION = 1;

const isValidDateKey = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= monthDays[month - 1];
};

const storageKey = (groupId: string, dateKey: string) => {
  if (!groupId.trim()) throw new Error("A group is required.");
  if (!isValidDateKey(dateKey))
    throw new Error("The attendance date is invalid.");
  return `buburuzele:attendance:${encodeURIComponent(groupId)}:${dateKey}`;
};

const isStatuses = (value: unknown): value is AttendanceStatuses =>
  value !== null &&
  typeof value === "object" &&
  Object.prototype.toString.call(value) === "[object Object]" &&
  Object.entries(value).every(
    ([studentId, status]) =>
      Boolean(studentId.trim()) &&
      (status === "present" || status === "absent" || status === "unverified"),
  );

const isSavedAt = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
};

const readStoredAttendance = (
  value: unknown,
  groupId: string,
  dateKey: string,
): AttendanceRecord => {
  if (value === undefined) return { statuses: {}, savedAt: null };
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (
      record.version === STORAGE_VERSION &&
      record.groupId === groupId &&
      record.dateKey === dateKey &&
      isStatuses(record.statuses) &&
      isSavedAt(record.savedAt)
    ) {
      return { statuses: { ...record.statuses }, savedAt: record.savedAt };
    }
  }

  // Never replace unreadable, misplaced, or newer records with empty attendance.
  throw new Error("The saved attendance could not be read.");
};

export const loadAttendance = async (
  groupId: string,
  dateKey: string,
): Promise<AttendanceRecord> =>
  readStoredAttendance(
    await get<unknown>(storageKey(groupId, dateKey)),
    groupId,
    dateKey,
  );

export const saveAttendanceRecord = async (
  groupId: string,
  dateKey: string,
  changes: AttendanceStatuses,
): Promise<AttendanceRecord> => {
  const key = storageKey(groupId, dateKey);
  if (!isStatuses(changes))
    throw new Error("The attendance details are invalid.");
  // Capture the submitted draft before waiting for the atomic transaction.
  const submittedChanges = { ...changes };
  let attendance: AttendanceRecord = { statuses: {}, savedAt: null };

  await update<unknown>(key, (current) => {
    const existing = readStoredAttendance(current, groupId, dateKey);
    attendance = {
      statuses: { ...existing.statuses, ...submittedChanges },
      savedAt: new Date().toISOString(),
    };
    return { version: STORAGE_VERSION, groupId, dateKey, ...attendance };
  });

  return attendance;
};
