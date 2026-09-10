import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "Components";

import "./StudentSetup.css";
import type { StudentSetupProps } from "./types";

const StudentSetup = ({ onClose }: StudentSetupProps) => {
  const { t: translate } = useTranslation("general");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextStudentId = useRef(0);
  const headingId = useId();
  const descriptionId = useId();
  const inputId = useId();
  const noteId = useId();
  const [name, setName] = useState("");
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
  const trimmedName = name.trim();
  const dismiss = () => {
    dialogRef.current?.close();
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();
    inputRef.current?.focus();

    return () => dialog?.close();
  }, []);

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={headingId}
      className="student-setup"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const isOutside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;

        if (isOutside) dismiss();
      }}
      ref={dialogRef}
    >
      <div className="student-setup__top-row">
        <span aria-hidden="true" className="student-setup__flower">✿</span>
        <Button onClick={dismiss} size="sm" variant="secondary">
          {translate("welcome.studentSetup.close")}
          <span aria-hidden="true">×</span>
        </Button>
      </div>

      <h2 id={headingId}>{translate("welcome.studentSetup.title")}</h2>
      <p className="student-setup__description" id={descriptionId}>
        {translate("welcome.studentSetup.description")}
      </p>

      <form
        className="student-setup__form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!trimmedName || trimmedName.length > 80) return;

          const student = { id: nextStudentId.current++, name: trimmedName };
          setStudents((current) => [...current, student]);
          setName("");
          inputRef.current?.focus();
        }}
      >
        <label htmlFor={inputId}>
          {translate("welcome.studentSetup.nameLabel")}
        </label>
        <div className="student-setup__entry">
          <input
            aria-describedby={noteId}
            autoComplete="off"
            id={inputId}
            maxLength={80}
            name="student-first-name"
            onChange={(event) => setName(event.target.value)}
            placeholder={translate("welcome.studentSetup.namePlaceholder")}
            ref={inputRef}
            required
            type="text"
            value={name}
          />
          <Button disabled={!trimmedName} size="sm" type="submit">
            {translate("welcome.studentSetup.add")}
          </Button>
        </div>
      </form>

      <div className="student-setup__students">
        <p aria-atomic="true" aria-live="polite" className="student-setup__count">
          {translate("welcome.studentSetup.count", { count: students.length })}
        </p>
        {students.length ? (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <span aria-hidden="true" className="student-setup__student-dot" />
                <span className="student-setup__student-name">{student.name}</span>
                <Button
                  aria-label={translate("welcome.studentSetup.remove", {
                    name: student.name,
                  })}
                  onClick={() =>
                    setStudents((current) =>
                      current.filter(({ id }) => id !== student.id),
                    )
                  }
                  shape="circle"
                  size="sm"
                  variant="secondary"
                >
                  <span aria-hidden="true">×</span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="student-setup__empty">
            {translate("welcome.studentSetup.empty")}
          </p>
        )}
      </div>

      <p className="student-setup__note" id={noteId}>
        {translate("welcome.studentSetup.previewNote")}
      </p>
    </dialog>
  );
};

export default StudentSetup;
