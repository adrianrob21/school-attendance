import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "./StudentVoice.css";
import type { Student } from "../../../../process/students";
import { prepareStudentVoice } from "../../../../process/students/voice";
import { useStudentVoice } from "../../../../process/students/useStudentVoice";

type StudentVoiceProps = {
  groupId: string;
  student: Student;
};

type Preparation = {
  key: string;
  requestId: number;
  isPreparing: boolean;
  hasError: boolean;
};

const StudentVoice = ({ groupId, student }: StudentVoiceProps) => {
  const { t: translate } = useTranslation("general");
  const { voice, isLoading, hasError } = useStudentVoice(groupId, student);
  const [preparation, setPreparation] = useState<Preparation | null>(null);
  const requestId = useRef(0);
  const key = JSON.stringify([groupId, student.id, student.fullName]);
  const currentPreparation = preparation?.key === key ? preparation : null;
  const isPreparing =
    isLoading ||
    Boolean(currentPreparation?.isPreparing) ||
    voice?.state === "preparing";
  const failed = hasError || Boolean(currentPreparation?.hasError);
  const ready = !isPreparing && voice?.state === "ready";
  const status = isPreparing
    ? "preparing"
    : ready
      ? "ready"
      : failed
        ? "retry"
        : "prepare";
  const label = translate(`students.voice.${status}`);
  const errorId = `student-${student.id}-voice-error`;

  const prepare = async () => {
    const currentRequest = ++requestId.current;
    setPreparation({
      key,
      requestId: currentRequest,
      isPreparing: true,
      hasError: false,
    });

    try {
      await prepareStudentVoice(groupId, student);
    } catch {
      setPreparation((current) =>
        current?.requestId === currentRequest
          ? { ...current, hasError: true }
          : current,
      );
    } finally {
      setPreparation((current) =>
        current?.requestId === currentRequest
          ? { ...current, isPreparing: false }
          : current,
      );
    }
  };

  return (
    <div className={`student-voice student-voice--${status}`}>
      {ready || isPreparing ? (
        <span
          aria-label={`${translate("students.voice.label", { name: student.fullName })}: ${label}`}
          className="student-voice__status"
          role="status"
        >
          <span aria-hidden="true" className="student-voice__indicator">
            {ready ? "✓" : "♪"}
          </span>
          {label}
        </span>
      ) : (
        <button
          aria-describedby={failed ? errorId : undefined}
          aria-label={`${label}: ${student.fullName}`}
          className="student-voice__action"
          onClick={() => void prepare()}
          type="button"
        >
          <span aria-hidden="true" className="student-voice__indicator">
            ♪
          </span>
          {label}
        </button>
      )}
      {failed && !isPreparing && !ready && (
        <span className="student-voice__error" id={errorId} role="status">
          {translate("students.voice.error")}
        </span>
      )}
    </div>
  );
};

export default StudentVoice;
