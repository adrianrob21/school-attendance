import type { AttendanceCounts, AttendanceStatuses } from "./types";

export const getAttendanceCounts = (
  studentIds: readonly string[],
  statuses: AttendanceStatuses,
): AttendanceCounts => {
  const counts: AttendanceCounts = { present: 0, absent: 0, unverified: 0 };

  for (const studentId of new Set(studentIds)) {
    const status = Object.hasOwn(statuses, studentId)
      ? statuses[studentId]
      : "unverified";
    if (status === "present") counts.present++;
    else if (status === "absent") counts.absent++;
    else counts.unverified++;
  }

  return counts;
};
