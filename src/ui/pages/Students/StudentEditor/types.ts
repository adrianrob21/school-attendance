import type { Student, StudentDraft } from "../../../../process/students";

export interface StudentEditorProps {
  student?: Student;
  onSave: (draft: StudentDraft) => Promise<unknown>;
  onDelete?: (id: string) => Promise<void>;
  onClose: () => void;
}
