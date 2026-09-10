import test from "node:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";

type VoiceResponse = { ok: boolean; json: () => Promise<unknown> };

const createWav = (sample: number) => {
  const bytes = Buffer.alloc(48);
  bytes.write("RIFF", 0);
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WAVEfmt ", 8);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(22050, 24);
  bytes.writeUInt32LE(44100, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(4, 40);
  bytes.writeInt16LE(sample, 44);
  bytes.writeInt16LE(sample, 46);
  return bytes;
};
const presentBytes = createWav(100);
const absentBytes = createWav(200);
const validResponse = (): VoiceResponse => ({
  ok: true,
  json: async () => ({
    present: Buffer.from(presentBytes).toString("base64"),
    absent: Buffer.from(absentBytes).toString("base64"),
    mimeType: "audio/wav",
    voiceId: "raluca-high-v3",
  }),
});
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

// Model atomic IndexedDB transactions independently from student/attendance data.
const setup = () => {
  const values = new Map<string, unknown>();
  const requests: Array<{
    url: string;
    options: { method: string; body: string; signal: AbortSignal };
    resolve: (response: VoiceResponse) => void;
    reject: (error: Error) => void;
  }> = [];
  let pending = Promise.resolve();
  let failingCommits = 0;
  const transaction = <T>(action: () => T): Promise<T> => {
    const result = pending.then(action);
    pending = result.then(
      () => {},
      () => {},
    );
    return result;
  };
  const idb = {
    get: (key: string) => transaction(() => structuredClone(values.get(key))),
    update: (key: string, updater: (value: unknown) => unknown) =>
      transaction(() => {
        const next = updater(structuredClone(values.get(key)));
        if (failingCommits > 0) {
          failingCommits--;
          throw new Error("Storage quota exceeded.");
        }
        values.set(key, structuredClone(next));
      }),
    del: (key: string) => transaction(() => values.delete(key)),
  };
  const modulePath = join(__dirname, "voice.js");
  const requireCompiled = createRequire(modulePath);
  const exports = {};
  runInNewContext(readFileSync(modulePath, "utf8"), {
    exports,
    Blob,
    Uint8Array,
    atob,
    AbortSignal,
    crypto: { randomUUID },
    fetch: (url: string, options: (typeof requests)[number]["options"]) =>
      new Promise<VoiceResponse>((resolve, reject) => {
        requests.push({ url, options, resolve, reject });
      }),
    require: (name: string) =>
      name === "idb-keyval" ? idb : requireCompiled(name),
  });
  return {
    repository: exports as typeof import("./voice"),
    values,
    requests,
    failCommits: (count: number) => {
      failingCommits = count;
    },
  };
};

const student = { id: "ana", fullName: "Ana Maria" };
const voiceKey = "buburuzele:student-voice:ladybugs:ana";

test("loads are local and never start a generation request", async () => {
  const { repository, values, requests } = setup();
  assert.equal(await repository.loadStudentVoice("ladybugs", "ana"), null);
  assert.equal(values.size, 0);
  values.set(voiceKey, {
    name: "Ana Maria",
    voiceId: "raluca-high-v3",
    requestId: "existing",
    state: "ready",
    present: new Blob([presentBytes], { type: "audio/wav" }),
    absent: new Blob([absentBytes], { type: "audio/wav" }),
  });
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "ready",
  );
  assert.equal(requests.length, 0);
});

test("old provider and Raluca v1/v2 recordings require explicit preparation for the unchanged name", async () => {
  for (const oldVoiceId of [
    undefined,
    "previous-voice-v1",
    "raluca-v1",
    "raluca-high-v2",
  ]) {
    const { repository, values, requests } = setup();
    const isOldRaluca =
      oldVoiceId === "raluca-v1" || oldVoiceId === "raluca-high-v2";
    const old = {
      name: student.fullName,
      state: "ready",
      requestId: "old-voice",
      ...(oldVoiceId ? { voiceId: oldVoiceId } : {}),
      present: new Blob([isOldRaluca ? presentBytes : "ID3old voice"], {
        type: isOldRaluca ? "audio/wav" : "audio/mpeg",
      }),
      absent: new Blob([isOldRaluca ? absentBytes : "ID3old voice"], {
        type: isOldRaluca ? "audio/wav" : "audio/mpeg",
      }),
    };
    values.set(voiceKey, old);
    assert.equal(await repository.loadStudentVoice("ladybugs", "ana"), null);
    assert.equal(requests.length, 0);
    assert.deepEqual(values.get(voiceKey), old);
    const prepare = repository.prepareStudentVoice("ladybugs", student);
    await flush();
    assert.equal(requests.length, 1);
    assert.deepEqual(JSON.parse(requests[0].options.body), {
      name: student.fullName,
    });
    requests[0].resolve(validResponse());
    await prepare;
    const saved = await repository.loadStudentVoice("ladybugs", "ana");
    assert.equal(saved?.voiceId, "raluca-high-v3");
    assert.equal(saved?.name, student.fullName);
    assert.equal(saved?.present?.type, "audio/wav");
    assert.equal(saved?.absent?.type, "audio/wav");
    await repository.prepareStudentVoice("ladybugs", student);
    assert.equal(requests.length, 1);
  }
});

test("preparing saves both clips together and cached repeat needs no request", async () => {
  const { repository, values, requests } = setup();
  const notifications: string[] = [];
  const unsubscribe = repository.subscribeStudentVoices(() => {
    notifications.push(
      (values.get(voiceKey) as { state: string })?.state || "deleted",
    );
  });
  const prepare = repository.prepareStudentVoice("ladybugs", {
    ...student,
    fullName: "  Ana   Maria  ",
  });
  await flush();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/api/student-voice");
  assert.equal(requests[0].options.method, "POST");
  assert.deepEqual(JSON.parse(requests[0].options.body), { name: "Ana Maria" });
  assert.ok(requests[0].options.signal instanceof AbortSignal);
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "preparing",
  );
  requests[0].resolve(validResponse());
  await prepare;
  const saved = await repository.loadStudentVoice("ladybugs", "ana");
  assert.equal(saved?.state, "ready");
  assert.equal(saved?.voiceId, "raluca-high-v3");
  assert.ok(saved?.present);
  assert.ok(saved?.absent);
  assert.deepEqual(
    Buffer.from(await saved.present.arrayBuffer()),
    presentBytes,
  );
  assert.deepEqual(Buffer.from(await saved.absent.arrayBuffer()), absentBytes);
  assert.equal(saved.present.type, "audio/wav");
  await repository.prepareStudentVoice("ladybugs", student);
  assert.equal(requests.length, 1);
  assert.deepEqual(notifications, ["preparing", "ready"]);
  unsubscribe();
  await repository.deleteStudentVoice("ladybugs", "ana");
  assert.deepEqual(notifications, ["preparing", "ready"]);
});

test("concurrent identical preparations share one request", async () => {
  const { repository, requests } = setup();
  const first = repository.prepareStudentVoice("ladybugs", student);
  const second = repository.prepareStudentVoice("ladybugs", student);
  await flush();
  assert.equal(requests.length, 1);
  requests[0].resolve(validResponse());
  await Promise.all([first, second]);
});

test("an older generation cannot replace a newer renamed student's clips", async () => {
  const { repository, requests } = setup();
  const first = repository.prepareStudentVoice("ladybugs", student);
  await flush();
  const second = repository.prepareStudentVoice("ladybugs", {
    ...student,
    fullName: "Ana Popescu",
  });
  await flush();
  requests[1].resolve(validResponse());
  await second;
  const latest = await repository.loadStudentVoice("ladybugs", "ana");
  requests[0].resolve(validResponse());
  await first;
  const saved = await repository.loadStudentVoice("ladybugs", "ana");
  assert.equal(saved?.name, "Ana Popescu");
  assert.equal(saved?.requestId, latest?.requestId);
  assert.equal(saved?.state, "ready");
});

test("a stale generation failure cannot change the newer ready voice", async () => {
  const { repository, requests } = setup();
  const first = repository.prepareStudentVoice("ladybugs", student);
  const rejectedFirst = assert.rejects(first, /network failed/);
  await flush();
  const second = repository.prepareStudentVoice("ladybugs", {
    ...student,
    fullName: "Ana Popescu",
  });
  await flush();
  requests[1].resolve(validResponse());
  await second;
  requests[0].reject(new Error("network failed"));
  await rejectedFirst;
  const saved = await repository.loadStudentVoice("ladybugs", "ana");
  assert.equal(saved?.name, "Ana Popescu");
  assert.equal(saved?.state, "ready");
});

test("deletion during generation prevents the result from recreating its record", async () => {
  for (const anotherTab of [false, true]) {
    const { repository, values, requests } = setup();
    let notifications = 0;
    repository.subscribeStudentVoices(() => notifications++);
    const prepare = repository.prepareStudentVoice("ladybugs", student);
    await flush();
    if (anotherTab) values.delete(voiceKey);
    else await repository.deleteStudentVoice("ladybugs", "ana");
    requests[0].resolve(validResponse());
    await prepare;
    assert.equal(await repository.loadStudentVoice("ladybugs", "ana"), null);
    assert.equal(values.has(voiceKey), false);
    assert.equal(notifications, 2);
  }
});

test("deletion before preparation starts skips the request entirely", async () => {
  const { repository, values, requests } = setup();
  const prepare = repository.prepareStudentVoice("ladybugs", student);
  const remove = repository.deleteStudentVoice("ladybugs", "ana");
  await Promise.all([prepare, remove]);
  assert.equal(values.has(voiceKey), false);
  assert.equal(requests.length, 0);
});

test("failure preserves unrelated student data and can be retried", async () => {
  const { repository, values, requests } = setup();
  const rosterKey = "buburuzele:students:ladybugs";
  const roster = { version: 1, students: [student] };
  const otherVoice = { name: "Ioana", state: "preparing", requestId: "other" };
  values.set(rosterKey, roster);
  values.set("buburuzele:student-voice:ladybugs:ioana", otherVoice);
  const prepare = repository.prepareStudentVoice("ladybugs", student);
  const rejected = assert.rejects(prepare, /could not be prepared/);
  await flush();
  requests[0].resolve({
    ok: false,
    json: async () => ({ secret: "upstream details" }),
  });
  await rejected;
  assert.deepEqual(values.get(rosterKey), roster);
  assert.deepEqual(
    values.get("buburuzele:student-voice:ladybugs:ioana"),
    otherVoice,
  );
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "error",
  );
  const retry = repository.prepareStudentVoice("ladybugs", student);
  await flush();
  requests[1].resolve(validResponse());
  await retry;
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "ready",
  );
});

test("one invalid clip never leaves a partially ready pair", async () => {
  const { repository, requests } = setup();
  const prepare = repository.prepareStudentVoice("ladybugs", student);
  const rejected = assert.rejects(prepare, /voice is invalid/);
  await flush();
  requests[0].resolve({
    ok: true,
    json: async () => ({
      present: Buffer.from(presentBytes).toString("base64"),
      absent: "not-an-audio-file",
      mimeType: "audio/wav",
      voiceId: "raluca-high-v3",
    }),
  });
  await rejected;
  const saved = await repository.loadStudentVoice("ladybugs", "ana");
  assert.equal(saved?.state, "error");
  assert.equal(saved?.present, undefined);
  assert.equal(saved?.absent, undefined);
});

test("backend metadata and real bounded WAV data are required", async () => {
  const truncated = presentBytes.subarray(0, presentBytes.length - 2);
  const wrongContainer = Buffer.from(presentBytes);
  wrongContainer.write("AVI ", 8);
  const noSamples = Buffer.from(presentBytes);
  noSamples.write("JUNK", 36);
  const oversized = Buffer.alloc(2 * 1024 * 1024 + 1).toString("base64");
  for (const invalid of [
    { voiceId: undefined },
    { voiceId: "previous-voice-v1" },
    { voiceId: "raluca-v1" },
    { voiceId: "raluca-high-v2" },
    { mimeType: "audio/mpeg" },
    { present: Buffer.from("ID3old audio").toString("base64") },
    { present: truncated.toString("base64") },
    { present: wrongContainer.toString("base64") },
    { present: noSamples.toString("base64") },
    { present: oversized },
  ]) {
    const { repository, requests } = setup();
    const prepare = repository.prepareStudentVoice("ladybugs", student);
    const rejected = assert.rejects(prepare, /voice is invalid/);
    await flush();
    requests[0].resolve({
      ok: true,
      json: async () => ({
        ...((await validResponse().json()) as Record<string, unknown>),
        ...invalid,
      }),
    });
    await rejected;
    const saved = await repository.loadStudentVoice("ladybugs", "ana");
    assert.equal(saved?.state, "error");
    assert.equal(saved?.present, undefined);
    assert.equal(saved?.absent, undefined);
  }
});

test("a cached pair with a missing audio Blob gets regenerated", async () => {
  const { repository, values, requests } = setup();
  values.set(voiceKey, {
    name: student.fullName,
    voiceId: "raluca-high-v3",
    state: "ready",
    requestId: "incomplete",
    present: new Blob([presentBytes], { type: "audio/wav" }),
  });
  assert.equal(await repository.loadStudentVoice("ladybugs", "ana"), null);
  const prepare = repository.prepareStudentVoice("ladybugs", student);
  await flush();
  requests[0].resolve(validResponse());
  await prepare;
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "ready",
  );
});

test("a preparing record left by a reload becomes retryable without writing or fetching", async () => {
  const { repository, values, requests } = setup();
  const stored = {
    name: student.fullName,
    voiceId: "raluca-high-v3",
    state: "preparing",
    requestId: "old-session",
  };
  values.set(voiceKey, stored);
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "error",
  );
  assert.deepEqual(values.get(voiceKey), stored);
  assert.equal(requests.length, 0);
});

test("failed audio and error-state commits clear pending work and notify retryable failure", async () => {
  const { repository, values, requests, failCommits } = setup();
  let notifications = 0;
  repository.subscribeStudentVoices(() => notifications++);
  const prepare = repository.prepareStudentVoice("ladybugs", student);
  const rejected = assert.rejects(prepare, /quota exceeded/);
  await flush();
  failCommits(2);
  requests[0].resolve(validResponse());
  await rejected;
  assert.equal((values.get(voiceKey) as { state: string }).state, "preparing");
  assert.equal(
    (await repository.loadStudentVoice("ladybugs", "ana"))?.state,
    "error",
  );
  assert.equal(notifications, 2);
});
