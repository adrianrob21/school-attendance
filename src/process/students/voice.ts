import { del, get, update } from "idb-keyval";

export type StudentVoice = {
  name: string;
  voiceId: "raluca-high-v3";
  state: "preparing" | "ready" | "error";
  present?: Blob;
  absent?: Blob;
  requestId: string;
};

const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const VOICE_ID = "raluca-high-v3";
const AUDIO_MIME_TYPE = "audio/wav";
const STALE_REQUEST = new Error("The voice request was superseded.");
const listeners = new Set<() => void>();
const pendingRequests = new Map<
  string,
  { name: string; requestId: string; promise: Promise<void>; started: boolean }
>();

const storageKey = (groupId: string, studentId: string) => {
  if (!groupId.trim() || !studentId.trim()) {
    throw new Error("A group and student are required.");
  }
  return `buburuzele:student-voice:${encodeURIComponent(groupId)}:${encodeURIComponent(studentId)}`;
};

const publish = () => {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      // Subscriber failures must not change saved audio or student data.
    }
  }
};

export const subscribeStudentVoices = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const isAudioBlob = (value: unknown): value is Blob =>
  value instanceof Blob &&
  value.type === AUDIO_MIME_TYPE &&
  value.size >= 44 &&
  value.size <= MAX_AUDIO_BYTES;

const readVoice = (value: unknown): StudentVoice | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<StudentVoice>;
  if (
    typeof record.name !== "string" ||
    !record.name ||
    record.voiceId !== VOICE_ID ||
    typeof record.requestId !== "string" ||
    !record.requestId ||
    !["preparing", "ready", "error"].includes(record.state || "")
  )
    return null;
  if (
    record.state === "ready" &&
    (!isAudioBlob(record.present) || !isAudioBlob(record.absent))
  )
    return null;
  return record as StudentVoice;
};

export const loadStudentVoice = async (
  groupId: string,
  studentId: string,
): Promise<StudentVoice | null> => {
  const key = storageKey(groupId, studentId);
  const record = readVoice(await get<unknown>(key));
  if (
    record?.state === "preparing" &&
    pendingRequests.get(key)?.requestId !== record.requestId
  ) {
    return { ...record, state: "error" };
  }
  return record;
};

const isWaveAudio = (bytes: Uint8Array): boolean => {
  if (bytes.length < 44 || bytes.length > MAX_AUDIO_BYTES) return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (offset: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + 4));
  if (
    tag(0) !== "RIFF" ||
    tag(8) !== "WAVE" ||
    view.getUint32(4, true) !== bytes.length - 8
  )
    return false;
  let hasFormat = false;
  let hasSamples = false;
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const size = view.getUint32(offset + 4, true);
    const end = offset + 8 + size;
    if (end > bytes.length) return false;
    if (tag(offset) === "fmt ") hasFormat = size >= 16;
    if (tag(offset) === "data") hasSamples = size > 0;
    offset = end + (size % 2);
  }
  return hasFormat && hasSamples && offset === bytes.length;
};

const decodeAudio = (value: unknown): Blob => {
  if (
    typeof value !== "string" ||
    !value ||
    value.length > Math.ceil(MAX_AUDIO_BYTES / 3) * 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      value,
    )
  ) {
    throw new Error("The generated voice is invalid.");
  }
  const bytes = Uint8Array.from(atob(value), (character) =>
    character.charCodeAt(0),
  );
  if (!isWaveAudio(bytes)) {
    throw new Error("The generated voice is invalid.");
  }
  return new Blob([bytes], { type: AUDIO_MIME_TYPE });
};

const updateOwnRequest = async (
  key: string,
  requestId: string,
  record: StudentVoice,
): Promise<boolean> => {
  try {
    await update<unknown>(key, (current) => {
      if (
        pendingRequests.get(key)?.requestId !== requestId ||
        readVoice(current)?.requestId !== requestId
      ) {
        // Throwing skips the write, including when another tab deleted the key.
        throw STALE_REQUEST;
      }
      return record;
    });
    return true;
  } catch (error) {
    if (error === STALE_REQUEST) return false;
    throw error;
  }
};

const prepareVoice = async (key: string, name: string, requestId: string) => {
  const record = { name, requestId, voiceId: VOICE_ID } as const;
  let alreadyReady = false;
  try {
    await update<unknown>(key, (current) => {
      if (pendingRequests.get(key)?.requestId !== requestId)
        throw STALE_REQUEST;
      const saved = readVoice(current);
      if (saved?.name === name && saved.state === "ready") {
        alreadyReady = true;
        return current;
      }
      return { ...record, state: "preparing" } satisfies StudentVoice;
    });
    if (alreadyReady || pendingRequests.get(key)?.requestId !== requestId)
      return;
    pendingRequests.get(key)!.started = true;
    publish();

    const response = await fetch("/api/student-voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok)
      throw new Error("The student's voice could not be prepared.");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") {
      throw new Error("The generated voice is invalid.");
    }
    const clips = result as {
      present?: unknown;
      absent?: unknown;
      mimeType?: unknown;
      voiceId?: unknown;
    };
    if (clips.mimeType !== AUDIO_MIME_TYPE || clips.voiceId !== VOICE_ID) {
      throw new Error("The generated voice is invalid.");
    }
    const present = decodeAudio(clips.present);
    const absent = decodeAudio(clips.absent);
    await updateOwnRequest(key, requestId, {
      ...record,
      state: "ready",
      present,
      absent,
    });
  } catch (error) {
    if (error === STALE_REQUEST) return;
    try {
      await updateOwnRequest(key, requestId, {
        ...record,
        state: "error",
      });
    } catch {
      // Keep the original generation/storage failure available to the caller.
    }
    throw error;
  }
};

export const prepareStudentVoice = async (
  groupId: string,
  student: { id: string; fullName: string },
): Promise<void> => {
  const key = storageKey(groupId, student.id);
  const name = student.fullName.normalize("NFC").trim().replace(/\s+/g, " ");
  if (!name || name.length > 120)
    throw new Error("The student name is invalid.");
  const existing = pendingRequests.get(key);
  if (existing?.name === name) return existing.promise;
  const pending = {
    name,
    requestId: crypto.randomUUID(),
    promise: Promise.resolve(),
    started: false,
  };
  pendingRequests.set(key, pending);
  pending.promise = prepareVoice(key, name, pending.requestId).finally(() => {
    if (pendingRequests.get(key) === pending) {
      pendingRequests.delete(key);
      if (pending.started) publish();
    }
  });
  return pending.promise;
};

export const deleteStudentVoice = async (
  groupId: string,
  studentId: string,
): Promise<void> => {
  const key = storageKey(groupId, studentId);
  pendingRequests.delete(key);
  await del(key);
  publish();
};
