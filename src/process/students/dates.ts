const parseBirthDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;

  // Noon avoids local midnight transitions. setFullYear also supports years < 100.
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
};

export const getTodayDateInput = (today = new Date()) =>
  `${String(today.getFullYear()).padStart(4, "0")}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export const isValidBirthDate = (value: string, today = new Date()) =>
  parseBirthDate(value) !== null && value <= getTodayDateInput(today);

const MIN_STUDENT_AGE = 2;

export const getLatestStudentBirthDateInput = (today = new Date()) => {
  const latestBirthDate = new Date(today);
  latestBirthDate.setFullYear(today.getFullYear() - MIN_STUDENT_AGE);
  // February 29 must clamp to February 28 when the birth year is not a leap year.
  if (latestBirthDate.getMonth() !== today.getMonth()) {
    latestBirthDate.setDate(0);
  }
  return getTodayDateInput(latestBirthDate);
};

export const isValidStudentBirthDate = (value: string, today = new Date()) =>
  isValidBirthDate(value, today) && value <= getLatestStudentBirthDateInput(today);

export const getStudentAge = (
  value: string,
  today = new Date(),
): number | null => {
  const birthDate = parseBirthDate(value);
  if (!birthDate || !isValidBirthDate(value, today)) return null;

  const birthdayHasPassed =
    today.getMonth() + 1 > birthDate.month ||
    (today.getMonth() + 1 === birthDate.month &&
      today.getDate() >= birthDate.day);

  return today.getFullYear() - birthDate.year - (birthdayHasPassed ? 0 : 1);
};

export const formatBirthDate = (value: string) => {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return "";

  return `${String(birthDate.day).padStart(2, "0")}.${String(
    birthDate.month,
  ).padStart(2, "0")}.${String(birthDate.year).padStart(4, "0")}`;
};
