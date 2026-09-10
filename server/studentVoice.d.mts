import type { IncomingMessage, ServerResponse } from "node:http";

export type StudentVoiceClips = {
  present: string;
  absent: string;
  mimeType: "audio/wav";
  voiceId: "raluca-high-v3";
};

export type StudentVoiceOptions = {
  pythonPath?: string;
  modelPath?: string;
  synthesize?: (name: string) => Promise<StudentVoiceClips>;
};

export function createStudentVoiceMiddleware(options?: StudentVoiceOptions): (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => unknown,
) => Promise<unknown>;
