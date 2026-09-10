import type { AttendanceCounts } from "../../../process/attendance";

export type TodaySessionProps = {
  dateKey: string;
  isExplicitDate: boolean;
  onNewDay: () => void;
};

export type AttendanceConfirmationProps = {
  counts: AttendanceCounts;
  dateLabel: string;
  isSaving: boolean;
  hasError: boolean;
  onClose: () => void;
  onSave: () => void;
};
