export type AttendanceStatus = "present" | "absent" | "unverified";

export type AttendanceStatuses = Record<string, AttendanceStatus>;

export type AttendanceRecord = {
  statuses: AttendanceStatuses;
  savedAt: string | null;
};

export type AttendanceCounts = {
  present: number;
  absent: number;
  unverified: number;
};

export type AttendanceSnapshot = AttendanceRecord & {
  isLoading: boolean;
  error: Error | null;
};

export type AttendanceState = {
  snapshot: AttendanceSnapshot;
  listeners: Set<() => void>;
  requestId: number;
};
