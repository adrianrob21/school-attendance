import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  loadStudents,
  saveStudentRecord,
  deleteStudentRecord,
} from "./storage";
import type { Student, StudentDraft } from "./types";
import { prepareStudentVoice, deleteStudentVoice } from "./voice";

type Snapshot = {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
};

type GroupState = {
  snapshot: Snapshot;
  listeners: Set<() => void>;
  requestId: number;
};

const groups = new Map<string, GroupState>();

const groupState = (groupId: string): GroupState => {
  let state = groups.get(groupId);
  if (!state) {
    state = {
      snapshot: { students: [], isLoading: true, error: null },
      listeners: new Set(),
      requestId: 0,
    };
    groups.set(groupId, state);
  }
  return state;
};

const publish = (state: GroupState, snapshot: Snapshot) => {
  state.snapshot = snapshot;
  state.listeners.forEach((listener) => listener());
};

const reloadStudents = async (groupId: string) => {
  const state = groupState(groupId);
  const requestId = ++state.requestId;
  publish(state, { ...state.snapshot, isLoading: true, error: null });

  try {
    const students = await loadStudents(groupId);
    if (requestId !== state.requestId) return;
    publish(state, { students, isLoading: false, error: null });
  } catch (error) {
    if (requestId !== state.requestId) return;
    publish(state, {
      ...state.snapshot,
      isLoading: false,
      error:
        error instanceof Error ? error : new Error("Could not load students."),
    });
  }
};

const publishStudents = (groupId: string, students: Student[]) => {
  const state = groupState(groupId);
  // A pending read may contain an older roster than this committed mutation.
  state.requestId++;
  publish(state, { students, isLoading: false, error: null });
};

export const useStudents = (groupId: string) => {
  const subscribe = useCallback(
    (listener: () => void) => {
      const state = groupState(groupId);
      state.listeners.add(listener);
      return () => state.listeners.delete(listener);
    },
    [groupId],
  );
  const getSnapshot = useCallback(
    () => groupState(groupId).snapshot,
    [groupId],
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const reload = useCallback(() => reloadStudents(groupId), [groupId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveStudent = useCallback(
    async (draft: StudentDraft): Promise<Student> => {
      const result = await saveStudentRecord(groupId, draft);
      publishStudents(groupId, result.students);
      // Speech preparation must never make a successfully saved child look unsaved.
      // The voice cache reuses unchanged names and publishes its own retry state.
      void prepareStudentVoice(groupId, result.student).catch(() => {});
      return result.student;
    },
    [groupId],
  );

  const deleteStudent = useCallback(
    async (studentId: string): Promise<void> => {
      const students = await deleteStudentRecord(groupId, studentId);
      publishStudents(groupId, students);
      await deleteStudentVoice(groupId, studentId).catch(() => {});
    },
    [groupId],
  );

  return { ...snapshot, reload, saveStudent, deleteStudent };
};
