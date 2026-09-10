import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "Components";

import "./StudentEditor.css";
import {
  cropStudentPhoto,
  getLatestStudentBirthDateInput,
  getStudentAge,
  isValidBirthDate,
  isValidStudentBirthDate,
  loadStudentPhoto,
  MAX_STUDENT_PHOTO_BYTES,
} from "../../../../process/students";
import StudentIcon from "../StudentIcon";
import StudentAvatar from "../StudentAvatar";
import type { StudentEditorProps } from "./types";

const StudentEditor = ({
  student,
  onSave,
  onDelete,
  onClose,
}: StudentEditorProps) => {
  const { t: translate } = useTranslation("general");
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const keepStudentRef = useRef<HTMLButtonElement>(null);
  const uploadVersionRef = useRef(0);
  const [fullName, setFullName] = useState(student?.fullName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(student?.dateOfBirth ?? "");
  const [photoSource, setPhotoSource] = useState(student?.photoDataUrl);
  const [photoPreview, setPhotoPreview] = useState(student?.photoDataUrl);
  const [crop, setCrop] = useState({ zoom: 1, offsetX: 0, offsetY: 0 });
  const [cropChanged, setCropChanged] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const age = getStudentAge(dateOfBirth);
  const nameIsValid =
    fullName.trim().length > 0 && fullName.trim().length <= 120;
  const birthDateIsValid = isValidStudentBirthDate(dateOfBirth);
  const busy = saving || deleting || photoLoading;
  const label = (key: string) => translate(`students.editor.${key}`);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const scrollContainer =
      document.scrollingElement instanceof HTMLElement
        ? document.scrollingElement
        : document.documentElement;
    const previousOverflow = scrollContainer.style.getPropertyValue("overflow");
    const previousOverflowPriority =
      scrollContainer.style.getPropertyPriority("overflow");
    const previousScrollTop = scrollContainer.scrollTop;
    const previousScrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.setProperty("overflow", "hidden");
    dialog?.showModal();
    nameRef.current?.focus();

    return () => {
      uploadVersionRef.current += 1;
      dialog?.close();
      if (previousOverflow) {
        scrollContainer.style.setProperty(
          "overflow",
          previousOverflow,
          previousOverflowPriority,
        );
      } else {
        scrollContainer.style.removeProperty("overflow");
      }
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
      scrollContainer.scrollTop = previousScrollTop;
      scrollContainer.scrollLeft = previousScrollLeft;
    };
  }, []);

  useEffect(() => {
    if (confirmDelete) keepStudentRef.current?.focus();
    else nameRef.current?.focus();
  }, [confirmDelete]);

  useEffect(() => {
    if (!photoSource || !cropChanged) return;

    let active = true;
    const timeout = window.setTimeout(() => {
      cropStudentPhoto(photoSource, crop)
        .then((result) => {
          if (active) setPhotoPreview(result);
        })
        .catch(() => {
          if (active) setPhotoError("students.errors.photoCrop");
        });
    }, 80);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [photoSource, crop, cropChanged]);

  const dismiss = () => {
    if (busy) return;
    dialogRef.current?.close();
    onClose();
  };

  const uploadPhoto = async (file: File) => {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size === 0 ||
      file.size > MAX_STUDENT_PHOTO_BYTES
    ) {
      setPhotoError("students.errors.invalidPhoto");
      return;
    }

    const version = ++uploadVersionRef.current;
    setPhotoLoading(true);
    setPhotoError("");

    try {
      const source = await loadStudentPhoto(file);
      const initialCrop = { zoom: 1, offsetX: 0, offsetY: 0 };
      const preview = await cropStudentPhoto(source, initialCrop);
      if (version !== uploadVersionRef.current) return;

      setPhotoSource(source);
      setPhotoPreview(preview);
      setCrop(initialCrop);
      setCropChanged(true);
    } catch {
      if (version === uploadVersionRef.current)
        setPhotoError("students.errors.photoLoad");
    } finally {
      if (version === uploadVersionRef.current) setPhotoLoading(false);
    }
  };

  const save = async () => {
    if (busy) return;
    setSubmitted(true);
    setError("");

    if (!nameIsValid) {
      nameRef.current?.focus();
      return;
    }

    if (!birthDateIsValid) {
      birthDateRef.current?.focus();
      return;
    }

    setSaving(true);

    try {
      const photoDataUrl =
        photoSource && cropChanged
          ? await cropStudentPhoto(photoSource, crop)
          : photoSource;
      await onSave({
        ...(student ? { id: student.id } : {}),
        fullName: fullName.trim(),
        dateOfBirth,
        photoDataUrl,
      });
      dialogRef.current?.close();
      onClose();
    } catch {
      setError("saveError");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async () => {
    if (!student || !onDelete || busy) return;
    setDeleting(true);
    setError("");

    try {
      await onDelete(student.id);
      dialogRef.current?.close();
      onClose();
    } catch {
      setError("deleteError");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <dialog
      aria-describedby={`${id}-description`}
      aria-labelledby={`${id}-heading`}
      className="student-editor"
      onCancel={(event) => {
        event.preventDefault();
        if (busy) return;
        if (confirmDelete) {
          setConfirmDelete(false);
          setError("");
        } else dismiss();
      }}
      onKeyDown={(event) => {
        if (
          event.key !== "Tab" ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        ) {
          return;
        }

        const dialog = event.currentTarget;
        const controls = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            "a[href], button, input, select, textarea, [tabindex]",
          ),
        ).filter(
          (control) =>
            control.tabIndex >= 0 &&
            !control.matches(":disabled") &&
            control.getClientRects().length > 0 &&
            window.getComputedStyle(control).visibility !== "hidden",
        );
        const first = controls[0];
        const last = controls.at(-1);
        const active = document.activeElement;

        if (!first || !last) {
          event.preventDefault();
          dialog.focus();
        } else if (!dialog.contains(active) || active === dialog) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      ref={dialogRef}
    >
      <header className="student-editor__header">
        <div className="student-editor__heading-row">
          <span aria-hidden="true" className="student-editor__flower">
            <StudentIcon name="flower" />
          </span>
          <Button
            aria-label={label("close")}
            disabled={busy}
            onClick={dismiss}
            shape="circle"
            size="sm"
            variant="secondary"
          >
            <StudentIcon name="close" />
          </Button>
        </div>
        <h2 id={`${id}-heading`}>
          {label(student ? "editTitle" : "addTitle")}
        </h2>
        <p id={`${id}-description`}>{label("subtitle")}</p>
      </header>

      <form
        aria-busy={busy}
        className="student-editor__form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!confirmDelete) void save();
        }}
      >
        <fieldset
          className="student-editor__fields"
          disabled={busy || confirmDelete}
        >
          <div className="student-editor__details">
            <div className="student-editor__field">
              <label htmlFor={`${id}-name`}>{label("fullName")}</label>
              <input
                aria-describedby={
                  submitted && !nameIsValid ? `${id}-name-error` : undefined
                }
                aria-invalid={submitted && !nameIsValid}
                autoComplete="off"
                id={`${id}-name`}
                maxLength={120}
                name="student-full-name"
                onChange={(event) => setFullName(event.target.value)}
                placeholder={label("fullNamePlaceholder")}
                ref={nameRef}
                required
                type="text"
                value={fullName}
              />
              {submitted && !nameIsValid && (
                <p
                  className="student-editor__field-error"
                  id={`${id}-name-error`}
                >
                  {label("nameRequired")}
                </p>
              )}
            </div>

            <div className="student-editor__date-row">
              <div className="student-editor__field student-editor__birth-date">
                <label htmlFor={`${id}-birth-date`}>{label("birthDate")}</label>
                <input
                  aria-describedby={
                    submitted && !birthDateIsValid
                      ? `${id}-date-error`
                      : undefined
                  }
                  aria-invalid={submitted && !birthDateIsValid}
                  id={`${id}-birth-date`}
                  max={getLatestStudentBirthDateInput()}
                  name="student-birth-date"
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  ref={birthDateRef}
                  required
                  type="date"
                  value={dateOfBirth}
                />
              </div>
              <div className="student-editor__field student-editor__age">
                <label htmlFor={`${id}-age`}>{label("age")}</label>
                <output
                  aria-live="polite"
                  htmlFor={`${id}-birth-date`}
                  id={`${id}-age`}
                >
                  {age === null
                    ? label("agePlaceholder")
                    : translate("students.age", { count: age })}
                </output>
              </div>
            </div>
            {submitted && !birthDateIsValid && (
              <p
                className="student-editor__field-error"
                id={`${id}-date-error`}
              >
                {label(
                  isValidBirthDate(dateOfBirth)
                    ? "minimumAge"
                    : "birthDateInvalid",
                )}
              </p>
            )}
          </div>

          <section
            aria-labelledby={`${id}-photo-heading`}
            className="student-editor__photo"
          >
            <div className="student-editor__photo-preview">
              <StudentAvatar
                className="student-editor__avatar"
                photoDataUrl={photoPreview}
              />
              <span className="student-editor__preview-name">
                {fullName.trim() || label("fullNamePlaceholder")}
              </span>
            </div>
            <div className="student-editor__photo-controls">
              <h3 id={`${id}-photo-heading`}>{label("photoTitle")}</h3>
              <p className="student-editor__hint" id={`${id}-photo-hint`}>
                {label("photoHint")}
              </p>
              <input
                accept="image/jpeg,image/png,image/webp"
                aria-label={label("uploadPhoto")}
                className="student-editor__file-input"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void uploadPhoto(file);
                }}
                ref={fileRef}
                tabIndex={-1}
                type="file"
              />
              <div className="student-editor__photo-actions">
                <Button
                  aria-describedby={`${id}-photo-hint`}
                  onClick={() => fileRef.current?.click()}
                  size="sm"
                  variant="secondary"
                >
                  <StudentIcon name="upload" />
                  {label(
                    photoLoading
                      ? "uploading"
                      : photoSource
                        ? "replacePhoto"
                        : "uploadPhoto",
                  )}
                </Button>
                {photoSource && (
                  <button
                    className="student-editor__text-button"
                    onClick={() => {
                      setPhotoSource(undefined);
                      setPhotoPreview(undefined);
                      setCropChanged(false);
                      setPhotoError("");
                    }}
                    type="button"
                  >
                    {label("removePhoto")}
                  </button>
                )}
              </div>
              {photoSource && (
                <div className="student-editor__crop-controls">
                  <p className="student-editor__crop-hint">
                    {label("cropHint")}
                  </p>
                  {(
                    [
                      ["zoom", "zoom", 1, 3],
                      ["offsetX", "horizontalPosition", -1, 1],
                      ["offsetY", "verticalPosition", -1, 1],
                    ] as const
                  ).map(([key, translationKey, min, max]) => (
                    <div className="student-editor__range" key={key}>
                      <label htmlFor={`${id}-${key}`}>
                        {label(translationKey)}
                      </label>
                      <input
                        id={`${id}-${key}`}
                        max={max}
                        min={min}
                        onChange={(event) => {
                          setCrop((current) => ({
                            ...current,
                            [key]: Number(event.target.value),
                          }));
                          setCropChanged(true);
                          setPhotoError("");
                        }}
                        step={0.01}
                        type="range"
                        value={crop[key]}
                      />
                    </div>
                  ))}
                </div>
              )}
              {photoError && (
                <p className="student-editor__field-error" role="alert">
                  {translate(photoError)}
                </p>
              )}
            </div>
          </section>
        </fieldset>

        {error && (
          <p className="student-editor__error" role="alert">
            {label(error)}
          </p>
        )}

        {confirmDelete ? (
          <section
            aria-labelledby={`${id}-delete-heading`}
            className="student-editor__confirmation"
          >
            <h3 id={`${id}-delete-heading`}>{label("deleteTitle")}</h3>
            <p>
              {translate("students.editor.deleteMessage", {
                name: student?.fullName,
              })}
            </p>
            <div className="student-editor__confirmation-actions">
              <Button
                disabled={busy}
                onClick={() => {
                  setConfirmDelete(false);
                  setError("");
                }}
                ref={keepStudentRef}
                size="sm"
                variant="secondary"
              >
                {label("keepStudent")}
              </Button>
              <Button
                disabled={busy}
                onClick={() => void deleteStudent()}
                size="sm"
              >
                <StudentIcon name="trash" />
                {label(deleting ? "deleting" : "confirmDelete")}
              </Button>
            </div>
          </section>
        ) : (
          <footer className="student-editor__footer">
            {student && onDelete && (
              <button
                className="student-editor__text-button student-editor__delete"
                disabled={busy}
                onClick={() => {
                  setConfirmDelete(true);
                  setError("");
                }}
                type="button"
              >
                <StudentIcon name="trash" />
                {label("delete")}
              </button>
            )}
            <div className="student-editor__save-actions">
              <Button
                disabled={busy}
                onClick={dismiss}
                size="sm"
                variant="secondary"
              >
                {label("cancel")}
              </Button>
              <Button disabled={busy} size="sm" type="submit">
                <StudentIcon name="check" />
                {label(saving ? "saving" : student ? "saveChanges" : "save")}
              </Button>
            </div>
          </footer>
        )}
      </form>
    </dialog>
  );
};

export default StudentEditor;
