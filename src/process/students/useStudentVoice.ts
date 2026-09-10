import { useEffect, useState } from "react";

import type { Student } from "./types";
import type { StudentVoice } from "./voice";
import { loadStudentVoice, subscribeStudentVoices } from "./voice";

type VoiceSnapshot = {
  key: string;
  voice: StudentVoice | null;
  hasError: boolean;
};

export const useStudentVoice = (
  groupId: string,
  student: Pick<Student, "id" | "fullName">,
) => {
  const studentId = student.id;
  const name = student.fullName.normalize("NFC").trim().replace(/\s+/g, " ");
  const key = JSON.stringify([groupId, studentId, name]);
  const [snapshot, setSnapshot] = useState<VoiceSnapshot | null>(null);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    const reload = async () => {
      const currentRequest = ++requestId;

      try {
        const savedVoice = await loadStudentVoice(groupId, studentId);
        if (!active || currentRequest !== requestId) return;

        // Never expose a previous name's clips while a rename is being saved.
        const voice =
          savedVoice?.name.normalize("NFC").trim().replace(/\s+/g, " ") === name
            ? savedVoice
            : null;
        setSnapshot({ key, voice, hasError: voice?.state === "error" });
      } catch {
        if (!active || currentRequest !== requestId) return;
        setSnapshot({ key, voice: null, hasError: true });
      }
    };

    // Subscribe before reading so a preparation finishing during the read is seen.
    const unsubscribe = subscribeStudentVoices(() => void reload());
    void reload();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [groupId, studentId, name, key]);

  const current = snapshot?.key === key ? snapshot : null;

  return {
    voice: current?.voice ?? null,
    isLoading: current === null,
    hasError: current?.hasError ?? false,
  };
};
