import { useEffect, useRef, useState } from "react";

import {
  loadStudentVoice,
  subscribeStudentVoices,
  type StudentVoice,
} from "../../../process/students/voice";
import type { Student } from "../../../process/students/types";
import { createAttendanceVoicePlayer } from "../../../process/attendance/voicePlayer";

const PREFERENCE_KEY = "buburuzele:attendance-voice-enabled";
const normalizedName = (name: string) =>
  name.normalize("NFC").trim().replace(/\s+/g, " ");
const readEnabled = () => {
  try {
    return localStorage.getItem(PREFERENCE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const useAttendanceVoice = (groupId: string, students: Student[]) => {
  const [enabled, setEnabled] = useState(readEnabled);
  const [error, setError] = useState<"missing" | "playback" | null>(null);
  const [clips, setClips] = useState<Map<string, StudentVoice>>(new Map());
  const playerRef = useRef<ReturnType<
    typeof createAttendanceVoicePlayer
  > | null>(null);

  useEffect(() => {
    let version = 0;
    let active = true;
    const refresh = async () => {
      const request = ++version;
      const entries = await Promise.all(
        students.map(async (student) => {
          const voice = await loadStudentVoice(groupId, student.id).catch(
            () => null,
          );
          return [student.id, voice] as const;
        }),
      );
      if (!active || request !== version) return;
      setClips(
        new Map(
          entries.filter(
            (entry): entry is readonly [string, StudentVoice] =>
              entry[1] !== null,
          ),
        ),
      );
    };
    const unsubscribe = subscribeStudentVoices(() => void refresh());
    void refresh();
    return () => {
      active = false;
      unsubscribe();
      playerRef.current?.stop();
    };
  }, [groupId, students]);

  useEffect(() => {
    const stopWhenHidden = () => {
      if (document.hidden) playerRef.current?.stop();
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", stopWhenHidden);
      playerRef.current?.stop();
    };
  }, []);

  const announce = (student: Student, status: "present" | "absent") => {
    if (!enabled) return;
    const saved = clips.get(student.id);
    const clip = saved?.[status];
    if (
      saved?.state !== "ready" ||
      saved.name !== normalizedName(student.fullName) ||
      !clip
    ) {
      playerRef.current?.stop();
      setError("missing");
      return;
    }
    setError(null);
    playerRef.current ??= createAttendanceVoicePlayer(() =>
      setError("playback"),
    );
    playerRef.current.play(clip);
  };

  const toggle = () => {
    const next = !enabled;
    if (!next) playerRef.current?.stop();
    setEnabled(next);
    setError(null);
    try {
      localStorage.setItem(PREFERENCE_KEY, String(next));
    } catch {
      // Muting still works when preferences cannot be persisted.
    }
  };

  return { enabled, error, announce, toggle };
};
