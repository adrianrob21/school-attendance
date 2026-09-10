import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef } from "react";

import { Button } from "Components";

import "./AttendanceConfirmation.css";
import AttendanceFace from "./AttendanceFace";
import StudentIcon from "../Students/StudentIcon";
import AttendanceLadybug from "./AttendanceLadybug";
import type { AttendanceConfirmationProps } from "./types";

const STATUSES = ["present", "absent", "unverified"] as const;

const AttendanceConfirmation = ({
  counts,
  dateLabel,
  isSaving,
  hasError,
  onClose,
  onSave,
}: AttendanceConfirmationProps) => {
  const { t: translate } = useTranslation("general");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    const container = document.documentElement;
    const overflow = container.style.overflow;
    container.style.overflow = "hidden";
    dialog.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog.close();
      container.style.overflow = overflow;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus();
    };
  }, []);

  return (
    <dialog
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      aria-busy={isSaving}
      className="attendance-confirmation"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <Button
        aria-label={translate("today.confirmation.close")}
        className="attendance-confirmation__close"
        disabled={isSaving}
        onClick={onClose}
        shape="circle"
        size="sm"
        variant="secondary"
      >
        <StudentIcon name="close" />
      </Button>
      <header className="attendance-confirmation__header">
        <h2 id={`${id}-title`}>{translate("today.confirmation.title")}</h2>
        <p>
          {translate("groupSelection.groups.ladybugs")} · {dateLabel}
        </p>
        <p
          id={`${id}-description`}
          className="attendance-confirmation__description"
        >
          {translate("today.confirmation.subtitle")}
        </p>
      </header>
      <dl className="attendance-confirmation__counts">
        {STATUSES.map((status) => (
          <div
            className={`attendance-confirmation__count attendance-tone--${status}`}
            key={status}
          >
            <AttendanceLadybug status={status} />
            <dt>{translate(`today.status.${status}`)}</dt>
            <dd>{counts[status]}</dd>
          </div>
        ))}
      </dl>
      <div
        className={`attendance-confirmation__note${counts.unverified ? "" : " attendance-confirmation__note--complete"}`}
      >
        <AttendanceFace status={counts.unverified ? "unverified" : "present"} />
        <p>
          {counts.unverified
            ? translate("today.confirmation.unverifiedNote", {
                count: counts.unverified,
              })
            : translate("today.confirmation.complete")}
        </p>
      </div>
      {counts.unverified > 0 && (
        <p className="attendance-confirmation__help">
          {translate("today.confirmation.unverifiedHelp")}
        </p>
      )}
      {hasError && (
        <p className="attendance-confirmation__error" role="alert">
          {translate("today.saveError")}
        </p>
      )}
      <footer className="attendance-confirmation__actions">
        <Button
          disabled={isSaving}
          onClick={onClose}
          ref={cancelRef}
          variant="secondary"
        >
          {translate("today.confirmation.cancel")}
        </Button>
        <Button disabled={isSaving} onClick={onSave}>
          {translate(isSaving ? "today.saving" : "today.confirmation.confirm")}
        </Button>
      </footer>
    </dialog>
  );
};

export default AttendanceConfirmation;
