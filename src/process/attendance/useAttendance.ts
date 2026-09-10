import { useCallback, useEffect, useSyncExternalStore } from "react";

import type {
  AttendanceState,
  AttendanceStatuses,
  AttendanceSnapshot,
} from "./types";
import { loadAttendance, saveAttendanceRecord } from "./storage";

const days = new Map<string, AttendanceState>();

const dayState = (groupId: string, dateKey: string): AttendanceState => {
  const key = JSON.stringify([groupId, dateKey]);
  let state = days.get(key);
  if (!state) {
    state = {
      snapshot: { statuses: {}, savedAt: null, isLoading: true, error: null },
      listeners: new Set(),
      requestId: 0,
    };
    days.set(key, state);
  }
  return state;
};

const publish = (state: AttendanceState, snapshot: AttendanceSnapshot) => {
  state.snapshot = snapshot;
  state.listeners.forEach((listener) => listener());
};

const reloadAttendance = async (groupId: string, dateKey: string) => {
  const state = dayState(groupId, dateKey);
  const requestId = ++state.requestId;
  publish(state, { ...state.snapshot, isLoading: true, error: null });

  try {
    const attendance = await loadAttendance(groupId, dateKey);
    if (requestId !== state.requestId) return;
    publish(state, { ...attendance, isLoading: false, error: null });
  } catch (error) {
    if (requestId !== state.requestId) return;
    publish(state, {
      ...state.snapshot,
      isLoading: false,
      error:
        error instanceof Error
          ? error
          : new Error("Could not load attendance."),
    });
  }
};

export const useAttendance = (groupId: string, dateKey: string) => {
  const subscribe = useCallback(
    (listener: () => void) => {
      const state = dayState(groupId, dateKey);
      state.listeners.add(listener);
      return () => state.listeners.delete(listener);
    },
    [groupId, dateKey],
  );
  const getSnapshot = useCallback(
    () => dayState(groupId, dateKey).snapshot,
    [groupId, dateKey],
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const reload = useCallback(
    () => reloadAttendance(groupId, dateKey),
    [groupId, dateKey],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveAttendance = useCallback(
    async (changes: AttendanceStatuses): Promise<void> => {
      const state = dayState(groupId, dateKey);
      const attendance = await saveAttendanceRecord(groupId, dateKey, changes);
      // An older read must not replace a successfully committed confirmation.
      state.requestId++;
      publish(state, { ...attendance, isLoading: false, error: null });
    },
    [groupId, dateKey],
  );

  return { ...snapshot, reload, saveAttendance };
};
