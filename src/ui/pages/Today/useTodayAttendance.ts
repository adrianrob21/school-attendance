import { useEffect, useState } from "react";

import { KINDERGARTEN_GROUPS } from "Constants";

import {
  getAttendanceCounts,
  useAttendance,
} from "../../../process/attendance";
import type { AttendanceStatus } from "../../../process/attendance";
import { getTodayDateInput, useStudents } from "../../../process/students";

const drafts = new Map<string, Record<string, AttendanceStatus>>();

export const useTodayAttendance = (dateKey: string) => {
  const groupId = KINDERGARTEN_GROUPS[0].id;
  const draftKey = `${groupId}:${dateKey}`;
  const roster = useStudents(groupId);
  const attendance = useAttendance(groupId, dateKey);
  const [changes, setChanges] = useState(() => drafts.get(draftKey) ?? {});
  const [currentDateKey, setCurrentDateKey] = useState(getTodayDateInput);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const statuses = { ...attendance.statuses, ...changes };
  const studentIds = roster.students.map(({ id }) => id);
  const counts = getAttendanceCounts(studentIds, statuses);
  const isDirty = studentIds.some(
    (id) =>
      changes[id] !== undefined &&
      changes[id] !== (attendance.statuses[id] ?? "unverified"),
  );
  const isLoading = roster.isLoading || attendance.isLoading;
  const hasError = Boolean(roster.error || attendance.error);

  useEffect(() => {
    const refresh = () => setCurrentDateKey(getTodayDateInput());
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    const protectDraft = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protectDraft);
    return () => window.removeEventListener("beforeunload", protectDraft);
  }, [isDirty]);

  const markStudent = (id: string, status: AttendanceStatus) => {
    if (isLoading || hasError || isSaving) return;
    const next = { ...changes, [id]: status };
    drafts.set(draftKey, next);
    setChanges(next);
    setSaveError(false);
  };

  const confirm = () => {
    setSaveError(false);
    setIsConfirming(true);
  };

  const closeConfirmation = () => {
    if (!isSaving) setIsConfirming(false);
  };

  const save = async () => {
    if (isSaving || isLoading || hasError) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      await attendance.saveAttendance(
        Object.fromEntries(
          studentIds
            .filter((id) => changes[id] !== undefined)
            .map((id) => [id, changes[id]]),
        ),
      );
      drafts.delete(draftKey);
      setChanges({});
      setIsConfirming(false);
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const reload = () => {
    void Promise.allSettled([roster.reload(), attendance.reload()]);
  };

  return {
    students: roster.students,
    savedAt: attendance.savedAt,
    isNewDay: currentDateKey !== dateKey,
    statuses,
    counts,
    isDirty,
    isLoading,
    hasError,
    isConfirming,
    isSaving,
    saveError,
    markStudent,
    confirm,
    closeConfirmation,
    save,
    reload,
  };
};
