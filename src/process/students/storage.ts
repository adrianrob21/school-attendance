import { get, update } from "idb-keyval";

import type { Student, StudentDraft } from "./types";
import { isValidBirthDate, isValidStudentBirthDate } from "./dates";

const STORAGE_VERSION = 1;
export const MAX_STUDENT_NAME_LENGTH = 120;

type StoredStudents = { version: typeof STORAGE_VERSION; students: Student[] };

const storageKey = (groupId: string) => {
  if (!groupId.trim()) throw new Error("A group is required.");
  return `buburuzele:students:${groupId}`;
};

const isStudent = (value: unknown): value is Student => {
  if (!value || typeof value !== "object") return false;
  const student = value as Partial<Student>;

  return (
    typeof student.id === "string" &&
    Boolean(student.id) &&
    typeof student.fullName === "string" &&
    Boolean(student.fullName.trim()) &&
    student.fullName.length <= MAX_STUDENT_NAME_LENGTH &&
    typeof student.dateOfBirth === "string" &&
    isValidBirthDate(student.dateOfBirth) &&
    (student.photoDataUrl === undefined ||
      (typeof student.photoDataUrl === "string" &&
        /^data:image\/(?:jpeg|png|webp);base64,/.test(student.photoDataUrl)))
  );
};

const readStoredStudents = (value: unknown): Student[] => {
  if (value === undefined) return [];

  if (!value || typeof value !== "object") {
    throw new Error("The saved students could not be read.");
  }

  const record = value as Partial<StoredStudents>;
  if (
    record.version !== STORAGE_VERSION ||
    !Array.isArray(record.students) ||
    !record.students.every(isStudent) ||
    new Set(record.students.map(({ id }) => id)).size !== record.students.length
  ) {
    // Never replace unreadable or newer data with an empty roster.
    throw new Error("The saved students could not be read.");
  }

  return record.students;
};

export const loadStudents = async (groupId: string): Promise<Student[]> =>
  readStoredStudents(await get<unknown>(storageKey(groupId)));

export const saveStudentRecord = async (
  groupId: string,
  draft: StudentDraft,
): Promise<{ student: Student; students: Student[] }> => {
  const student: Student = {
    id: draft.id ?? crypto.randomUUID(),
    fullName: draft.fullName.trim().replace(/\s+/g, " "),
    dateOfBirth: draft.dateOfBirth,
    ...(draft.photoDataUrl ? { photoDataUrl: draft.photoDataUrl } : {}),
  };
  if (!isStudent(student)) throw new Error("The student details are invalid.");
  if (!isValidStudentBirthDate(student.dateOfBirth)) {
    throw new Error("Children must be at least 2 years old.");
  }

  let students: Student[] = [];
  await update<unknown>(storageKey(groupId), (current) => {
    students = readStoredStudents(current);
    const index = students.findIndex(({ id }) => id === student.id);

    if (draft.id && index === -1) {
      throw new Error(
        "This student no longer exists. Please reload the class.",
      );
    }

    students =
      index === -1
        ? [...students, student]
        : students.map((existing) =>
            existing.id === student.id ? student : existing,
          );

    return { version: STORAGE_VERSION, students } satisfies StoredStudents;
  });

  return { student, students };
};

export const deleteStudentRecord = async (
  groupId: string,
  studentId: string,
): Promise<Student[]> => {
  let students: Student[] = [];
  await update<unknown>(storageKey(groupId), (current) => {
    students = readStoredStudents(current).filter(({ id }) => id !== studentId);
    return { version: STORAGE_VERSION, students } satisfies StoredStudents;
  });
  return students;
};
