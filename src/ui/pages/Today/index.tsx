import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import {
  CALENDAR_PATH,
  STUDENTS_PATH,
  WELCOME_PATH,
  KINDERGARTEN_GROUPS,
} from "Constants";
import { Button } from "Components";

import "./Today.css";
import "../Students/Students.css";
import AttendanceFace from "./AttendanceFace";
import StudentBirthday from "./StudentBirthday";
import type { TodaySessionProps } from "./types";
import StudentIcon from "../Students/StudentIcon";
import { useRosterLayout } from "./useRosterLayout";
import StudentAvatar from "../Students/StudentAvatar";
import { useAttendanceVoice } from "./useAttendanceVoice";
import { useTodayAttendance } from "./useTodayAttendance";
import { getTodayDateInput } from "../../../process/students";
import AttendanceConfirmation from "./AttendanceConfirmation";
import { getDateKey, parseDateKey } from "../Calendar/calendar";

const STATUSES = ["present", "absent", "unverified"] as const;
const ACTIONS = ["present", "absent"] as const;

const TodaySession = ({
  dateKey,
  isExplicitDate,
  onNewDay,
}: TodaySessionProps) => {
  const { t: translate, i18n } = useTranslation("general");
  const attendance = useTodayAttendance(dateKey);
  const voice = useAttendanceVoice(
    KINDERGARTEN_GROUPS[0].id,
    attendance.students,
  );
  const [announcement, setAnnouncement] = useState("");
  const [page, setPage] = useState(0);
  const rosterRef = useRef<HTMLDivElement>(null);
  const layout = useRosterLayout(rosterRef);
  const pageCount = Math.max(
    1,
    Math.ceil(attendance.students.length / layout.pageSize),
  );
  const currentPage = Math.min(page, pageCount - 1);
  const visibleStudents = attendance.students.slice(
    currentPage * layout.pageSize,
    (currentPage + 1) * layout.pageSize,
  );
  const locale = i18n.resolvedLanguage || i18n.language;
  const date = new Date(`${dateKey}T12:00:00`);
  const dateLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(date);
  const shortDateLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(date);
  const ready = !attendance.isLoading && !attendance.hasError;

  return (
    <main className="students-page today-page meadow-background">
      <div className="students-page__content">
        <header className="students-page__header today-page__header">
          <Link
            aria-label={translate("today.back")}
            className="students-page__back"
            to={WELCOME_PATH}
          >
            <StudentIcon name="arrow-left" />
          </Link>
          <div className="today-page__heading">
            <div className="students-page__title-panel">
              <span
                aria-hidden="true"
                className="students-page__flowers students-page__flowers--left"
              />
              <h1>
                {translate(
                  isExplicitDate ? "today.attendanceTitle" : "today.title",
                )}
              </h1>
              <span
                aria-hidden="true"
                className="students-page__flowers students-page__flowers--right"
              />
            </div>
            <p className="today-page__date">
              {translate("groupSelection.groups.ladybugs")} ·{" "}
              <time dateTime={dateKey}>{dateLabel}</time>
            </p>
          </div>
          <Link
            className="today-page__calendar"
            to={`${CALENDAR_PATH}?date=${dateKey}`}
          >
            {translate("today.calendar")} <span aria-hidden="true">↗</span>
          </Link>
        </header>

        {!isExplicitDate && attendance.isNewDay && (
          <div className="today-page__new-day" role="status">
            <p>{translate("today.newDay", { date: shortDateLabel })}</p>
            <Button
              disabled={attendance.isDirty || attendance.isSaving}
              onClick={onNewDay}
              size="sm"
              variant="secondary"
            >
              {translate("today.startNewDay")}
            </Button>
          </div>
        )}

        <section
          className="students-page__frame today-page__frame"
          aria-label={translate("today.rosterLabel")}
          aria-busy={attendance.isLoading}
        >
          <div className="students-page__toolbar today-page__toolbar">
            <h2>
              {translate("students.count", {
                count: attendance.students.length,
              })}
            </h2>
            <button
              aria-label={translate("today.voice.label")}
              aria-pressed={voice.enabled}
              className="today-page__voice-toggle"
              title={translate(
                voice.enabled ? "today.voice.turnOff" : "today.voice.turnOn",
              )}
              onClick={voice.toggle}
              type="button"
            >
              <span aria-hidden="true">{voice.enabled ? "🔊" : "🔇"}</span>
              <span>
                {translate(
                  voice.enabled ? "today.voice.on" : "today.voice.off",
                )}
              </span>
            </button>
            {ready && attendance.students.length > 0 && (
              <div
                className="today-page__progress"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>
                  {translate("today.progress", {
                    verified:
                      attendance.counts.present + attendance.counts.absent,
                    total: attendance.students.length,
                  })}
                </span>
                <span aria-hidden="true" className="today-page__progress-track">
                  <span
                    style={{
                      width: `${((attendance.counts.present + attendance.counts.absent) / attendance.students.length) * 100}%`,
                    }}
                  />
                </span>
              </div>
            )}
          </div>

          {voice.error && (
            <p className="today-page__voice-note" role="status">
              {translate(`today.voice.${voice.error}`)}
              {voice.error === "missing" && (
                <>
                  {" "}
                  <Link to={STUDENTS_PATH}>
                    {translate("today.voice.prepare")}
                  </Link>
                </>
              )}
            </p>
          )}
          <div className="today-page__roster-viewport" ref={rosterRef}>
            {attendance.isLoading ? (
              <div className="students-page__empty" role="status">
                <StudentAvatar />
                <p>{translate("today.loading")}</p>
              </div>
            ) : attendance.hasError ? (
              <div className="students-page__empty" role="alert">
                <StudentAvatar />
                <p>{translate("today.loadError")}</p>
                <Button
                  onClick={attendance.reload}
                  size="sm"
                  variant="secondary"
                >
                  {translate("today.retry")}
                </Button>
              </div>
            ) : attendance.students.length === 0 ? (
              <div className="students-page__empty">
                <StudentAvatar />
                <h3>{translate("today.emptyTitle")}</h3>
                <p>{translate("today.emptyBody")}</p>
                <Link
                  className="ui-button ui-button--primary ui-button--sm"
                  to={STUDENTS_PATH}
                >
                  {translate("today.emptyAction")}
                </Link>
              </div>
            ) : (
              <ul
                className="students-page__roster today-page__roster"
                style={{
                  gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${layout.rows}, var(--attendance-row-height))`,
                }}
              >
                {visibleStudents.map((student) => {
                  const status =
                    attendance.statuses[student.id] ?? "unverified";
                  return (
                    <li className="attendance-student" key={student.id}>
                      <div className="attendance-student__art">
                        <StudentAvatar
                          className="attendance-student__avatar"
                          photoDataUrl={student.photoDataUrl}
                        />
                        <StudentBirthday
                          dateOfBirth={student.dateOfBirth}
                          dateKey={dateKey}
                        />
                      </div>
                      <h3
                        id={`attendance-name-${student.id}`}
                        title={student.fullName}
                      >
                        {student.fullName}
                      </h3>
                      <div
                        className={`attendance-student__status attendance-tone--${status}`}
                      >
                        <span>{translate(`today.status.${status}`)}</span>
                        <AttendanceFace status={status} />
                      </div>
                      <div
                        className="attendance-student__actions"
                        role="group"
                        aria-labelledby={`attendance-name-${student.id}`}
                      >
                        {ACTIONS.map((action) => (
                          <button
                            aria-label={translate(
                              action === "present"
                                ? "today.markPresent"
                                : "today.markAbsent",
                              { name: student.fullName },
                            )}
                            aria-pressed={status === action}
                            className={`attendance-student__button attendance-student__button--${action}`}
                            disabled={attendance.isSaving}
                            key={action}
                            type="button"
                            onClick={() => {
                              attendance.markStudent(student.id, action);
                              voice.announce(student, action);
                              setAnnouncement(
                                translate("today.changeAnnouncement", {
                                  name: student.fullName,
                                  status: translate(`today.status.${action}`),
                                }),
                              );
                            }}
                          >
                            {translate(`today.status.${action}`)}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {ready && attendance.students.length > 0 && (
            <footer className="today-page__footer">
              <div className="today-page__footer-summary">
                <ul
                  aria-label={translate("today.confirmation.title")}
                  className="today-page__totals"
                >
                  {STATUSES.map((status) => (
                    <li className={`attendance-tone--${status}`} key={status}>
                      <strong>{attendance.counts[status]}</strong>{" "}
                      {translate(`today.status.${status}`)}
                    </li>
                  ))}
                </ul>
                <p
                  className={`today-page__save-state${attendance.isDirty ? "" : " today-page__save-state--saved"}`}
                  role="status"
                >
                  {attendance.isDirty
                    ? translate("today.pendingChanges")
                    : attendance.savedAt
                      ? translate("today.saved")
                      : ""}
                </p>
              </div>
              {pageCount > 1 && (
                <nav
                  className="today-page__pagination"
                  aria-label={translate("today.pagination")}
                >
                  <button
                    type="button"
                    aria-label={translate("today.previousPage")}
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    ‹
                  </button>
                  <span aria-live="polite" aria-atomic="true">
                    {translate("today.page", {
                      current: currentPage + 1,
                      total: pageCount,
                    })}
                  </span>
                  <button
                    type="button"
                    aria-label={translate("today.nextPage")}
                    disabled={currentPage === pageCount - 1}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    ›
                  </button>
                </nav>
              )}
              <Button
                aria-haspopup="dialog"
                className="today-page__confirm"
                disabled={attendance.isSaving}
                onClick={attendance.confirm}
              >
                <span aria-hidden="true">✓</span>
                {translate("today.confirmAttendance")}
              </Button>
            </footer>
          )}
        </section>
        <p
          className="students-page__announcement"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </p>
      </div>
      {attendance.isConfirming && (
        <AttendanceConfirmation
          counts={attendance.counts}
          dateLabel={shortDateLabel}
          hasError={attendance.saveError}
          isSaving={attendance.isSaving}
          onClose={attendance.closeConfirmation}
          onSave={() => void attendance.save()}
        />
      )}
    </main>
  );
};

const Today = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todayDateKey, setTodayDateKey] = useState(getTodayDateInput);
  const selectedDate = parseDateKey(searchParams.get("date") ?? "");
  const dateKey = selectedDate ? getDateKey(selectedDate) : todayDateKey;

  return (
    <TodaySession
      key={dateKey}
      dateKey={dateKey}
      isExplicitDate={selectedDate !== null}
      onNewDay={() => {
        setTodayDateKey(getTodayDateInput());
        if (searchParams.has("date")) {
          setSearchParams(
            (current) => {
              const next = new URLSearchParams(current);
              next.delete("date");
              return next;
            },
            { replace: true },
          );
        }
      }}
    />
  );
};

export default Today;
