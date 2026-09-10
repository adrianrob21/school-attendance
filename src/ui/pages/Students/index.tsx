import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import { Button } from "Components";
import { KINDERGARTEN_GROUPS, WELCOME_PATH } from "Constants";

import "./Students.css";
import {
  formatBirthDate,
  getStudentAge,
  useStudents,
} from "../../../process/students";
import StudentIcon from "./StudentIcon";
import StudentVoice from "./StudentVoice";
import StudentAvatar from "./StudentAvatar";
import StudentEditor from "./StudentEditor";
import type { Student, StudentDraft } from "../../../process/students";

const Students = () => {
  const { t: translate, i18n } = useTranslation("general");
  const { students, isLoading, error, saveStudent, deleteStudent, reload } =
    useStudents(KINDERGARTEN_GROUPS[0].id);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<Student | "new" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [today, setToday] = useState(() => new Date());
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const normalizedQuery = query
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(i18n.language);
  const visibleStudents = students.filter((student) =>
    student.fullName
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase(i18n.language)
      .includes(normalizedQuery),
  );

  useEffect(() => {
    const refreshDate = () => setToday(new Date());
    const interval = window.setInterval(refreshDate, 60_000);
    document.addEventListener("visibilitychange", refreshDate);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshDate);
    };
  }, []);

  const save = async (draft: StudentDraft) => {
    await saveStudent(draft);
    setAnnouncement(
      translate(
        draft.id ? "students.success.updated" : "students.success.added",
        { name: draft.fullName },
      ),
    );
    if (!draft.id) setQuery("");
  };

  const remove = async (id: string) => {
    const name = students.find((student) => student.id === id)?.fullName;
    await deleteStudent(id);
    setAnnouncement(translate("students.success.deleted", { name }));
  };

  return (
    <main className="students-page meadow-background">
      <div className="students-page__content">
        <header className="students-page__header">
          <Link
            aria-label={translate("students.back")}
            className="students-page__back"
            to={WELCOME_PATH}
          >
            <StudentIcon name="arrow-left" />
          </Link>
          <div className="students-page__title-panel">
            <span
              aria-hidden="true"
              className="students-page__flowers students-page__flowers--left"
            />
            <h1>{translate("students.title")}</h1>
            <span
              aria-hidden="true"
              className="students-page__flowers students-page__flowers--right"
            />
          </div>
        </header>

        <section
          aria-label={translate("students.rosterLabel")}
          aria-busy={isLoading}
          className="students-page__frame"
        >
          <div className="students-page__toolbar">
            <h2 aria-live="polite" aria-atomic="true">
              {translate("students.count", { count: students.length })}
            </h2>
            <div className="students-page__controls">
              <div className="students-page__search">
                <StudentIcon name="search" />
                <input
                  aria-label={translate("students.search")}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={translate("students.searchPlaceholder")}
                  type="search"
                  value={query}
                />
              </div>
              <Button
                ref={addButtonRef}
                disabled={isLoading || Boolean(error)}
                onClick={() => setEditor("new")}
                size="sm"
              >
                <StudentIcon name="plus" />
                {translate("students.add")}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="students-page__empty" role="status">
              <StudentAvatar />
              <p>{translate("students.loading")}</p>
            </div>
          ) : error ? (
            <div className="students-page__empty" role="alert">
              <StudentAvatar />
              <p>{translate("students.errors.storageLoad")}</p>
              <Button
                onClick={() => void reload().catch(() => undefined)}
                size="sm"
                variant="secondary"
              >
                {translate("students.retry")}
              </Button>
            </div>
          ) : students.length === 0 ? (
            <div className="students-page__empty">
              <StudentAvatar />
              <h3>{translate("students.emptyTitle")}</h3>
              <p>{translate("students.emptyBody")}</p>
              <Button onClick={() => setEditor("new")} size="sm">
                <StudentIcon name="plus" />
                {translate("students.emptyAction")}
              </Button>
            </div>
          ) : visibleStudents.length === 0 ? (
            <div className="students-page__empty" role="status">
              <StudentIcon name="search" />
              <h3>{translate("students.noResults")}</h3>
              <Button
                onClick={() => setQuery("")}
                size="sm"
                variant="secondary"
              >
                {translate("students.clearSearch")}
              </Button>
            </div>
          ) : (
            <ul className="students-page__roster">
              {visibleStudents.map((student) => (
                <li className="student-entry" key={student.id}>
                  <button
                    aria-label={translate("students.editStudent", {
                      name: student.fullName,
                    })}
                    aria-haspopup="dialog"
                    aria-describedby={`student-${student.id}-age student-${student.id}-dob`}
                    className="student-entry__main"
                    onClick={() => setEditor(student)}
                    type="button"
                  >
                    <span className="student-entry__art">
                      <StudentAvatar photoDataUrl={student.photoDataUrl} />
                      {!student.photoDataUrl && (
                        <span className="student-entry__camera">
                          <StudentIcon name="camera" />
                        </span>
                      )}
                    </span>
                    <span className="student-entry__name">
                      {student.fullName}
                    </span>
                    <span
                      className="student-entry__age"
                      id={`student-${student.id}-age`}
                    >
                      {translate("students.age", {
                        count: getStudentAge(student.dateOfBirth, today) ?? 0,
                      })}
                    </span>
                    <span
                      className="student-entry__dob"
                      id={`student-${student.id}-dob`}
                    >
                      {translate("students.bornOn", {
                        date: formatBirthDate(student.dateOfBirth),
                      })}
                    </span>
                  </button>
                  <StudentVoice
                    groupId={KINDERGARTEN_GROUPS[0].id}
                    student={student}
                  />
                  <button
                    aria-label={translate("students.actions", {
                      name: student.fullName,
                    })}
                    aria-haspopup="dialog"
                    className="student-entry__options"
                    onClick={() => setEditor(student)}
                    type="button"
                  >
                    <StudentIcon name="more" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="students-page__hint">
            {translate("students.hint")}{" "}
            {translate("students.voice.disclosure")}
          </p>
        </section>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="students-page__announcement"
        >
          {announcement}
        </p>
      </div>
      {editor !== null && (
        <StudentEditor
          key={editor === "new" ? "new" : editor.id}
          student={editor === "new" ? undefined : editor}
          onSave={save}
          onDelete={remove}
          onClose={() => {
            setEditor(null);
            requestAnimationFrame(() => {
              if (document.activeElement === document.body) {
                addButtonRef.current?.focus();
              }
            });
          }}
        />
      )}
    </main>
  );
};

export default Students;
