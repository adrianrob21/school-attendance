export type AttendanceVisualStatus = "present" | "absent" | "unverified";

export type AttendanceFaceProps = {
  status: AttendanceVisualStatus;
  className?: string;
};
