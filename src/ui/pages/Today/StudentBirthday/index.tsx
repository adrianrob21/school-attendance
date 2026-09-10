import { useTranslation } from "react-i18next";

import "./StudentBirthday.css";
import type { StudentBirthdayProps } from "./types";
import { parseDateKey } from "../../Calendar/calendar";

const StudentBirthday = ({
  dateOfBirth,
  dateKey,
  className,
}: StudentBirthdayProps) => {
  const { t: translate, i18n } = useTranslation("general");
  const birthday = parseDateKey(dateOfBirth);
  const attendanceDate = parseDateKey(dateKey);
  if (!birthday) return null;

  const isBirthday =
    attendanceDate !== null &&
    attendanceDate.getFullYear() >= birthday.getFullYear() &&
    attendanceDate.getMonth() === birthday.getMonth() &&
    attendanceDate.getDate() === birthday.getDate();
  const locale = i18n.resolvedLanguage || i18n.language;
  const shortDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(birthday);
  const fullDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(birthday);
  const label = translate(
    isBirthday ? "today.birthdayToday" : "today.birthday",
    { date: fullDate },
  );
  const classes = [
    "student-birthday",
    isBirthday && "student-birthday--today",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span aria-label={label} className={classes} role="img" title={label}>
      <svg
        aria-hidden="true"
        className="student-birthday__cake"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          className="student-birthday__flame"
          d="M12 1c-1.2 1.2-1.7 1.9-1.7 2.7a1.7 1.7 0 0 0 3.4 0C13.7 2.9 13.2 2.2 12 1Z"
        />
        <path d="M12 6v4" />
        <path
          className="student-birthday__icing"
          d="M5 10h14a2 2 0 0 1 2 2v3c-1 1.8-2.9 1.8-4 0-1.2 1.8-3 1.8-5 0-2 1.8-3.8 1.8-5 0-1.1 1.8-3 1.8-4 0v-3a2 2 0 0 1 2-2Z"
        />
        <path d="M4 16v5h16v-5M2 21h20" />
      </svg>
      <time aria-hidden="true" dateTime={dateOfBirth}>
        {shortDate}
      </time>
    </span>
  );
};

export default StudentBirthday;
