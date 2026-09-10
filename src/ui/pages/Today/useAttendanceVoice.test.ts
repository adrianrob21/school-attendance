import test from "node:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";

import type { Student } from "../../../process/students/types";
import type { StudentVoice } from "../../../process/students/voice";

const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
const student: Student = {
  id: "ana",
  fullName: "Ana Maria",
  dateOfBirth: "2021-06-14",
};
const savedVoice = (name = student.fullName): StudentVoice => ({
  name,
  voiceId: "raluca-high-v3",
  state: "ready",
  requestId: "saved-request",
  present: new Blob(["saved present recording"], { type: "audio/wav" }),
  absent: new Blob(["saved absent recording"], { type: "audio/wav" }),
});

type Effect = { dependencies: unknown[]; cleanup?: () => void };

// Run the actual hook and player together while controlling the browser's audio
// promises. React state persists across explicit renders; effects clean up normally.
const setup = (initialVoice: StudentVoice | null = null) => {
  const records = new Map<string, StudentVoice>();
  if (initialVoice) records.set(student.id, initialVoice);
  const state = new Map<number, unknown>();
  const refs = new Map<number, { current: unknown }>();
  const effects = new Map<number, Effect>();
  const cacheListeners = new Set<() => void>();
  const documentListeners = new Map<string, () => void>();
  const preferences = new Map<string, string>();
  const createdUrls: Array<{ url: string; blob: Blob }> = [];
  const revokedUrls: string[] = [];
  const reads: Array<{ groupId: string; studentId: string }> = [];
  const plays: Array<{
    src: string;
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];
  const audioInstances: FakeAudio[] = [];
  let cursor = 0;
  let mounted = true;
  let updatesAfterUnmount = 0;
  let generationRequests = 0;
  let networkRequests = 0;
  let scheduledEffects: Array<() => void> = [];
  let roster = [student];

  class FakeAudio {
    src = "";
    error: Error | null = null;
    onerror: (() => void) | null = null;
    onended: (() => void) | null = null;
    pauses = 0;

    constructor() {
      audioInstances.push(this);
    }

    play() {
      return new Promise<void>((resolve, reject) => {
        plays.push({ src: this.src, resolve, reject });
      });
    }

    pause() {
      this.pauses++;
    }

    removeAttribute(attribute: string) {
      if (attribute === "src") this.src = "";
    }

    load() {}
  }

  const document = {
    hidden: false,
    addEventListener: (name: string, callback: () => void) => {
      documentListeners.set(name, callback);
    },
    removeEventListener: (name: string) => {
      documentListeners.delete(name);
    },
  };
  const browser = {
    Audio: FakeAudio,
    URL: {
      createObjectURL: (blob: Blob) => {
        assert.ok(blob instanceof Blob);
        const url = `blob:cached-voice-${createdUrls.length + 1}`;
        createdUrls.push({ url, blob });
        return url;
      },
      revokeObjectURL: (url: string) => revokedUrls.push(url),
    },
    fetch: () => {
      networkRequests++;
      throw new Error("Attendance must not request audio from the network.");
    },
  };
  const playerExports = {};
  const playerPath = join(
    __dirname,
    "../../../process/attendance/voicePlayer.js",
  );
  runInNewContext(readFileSync(playerPath, "utf8"), {
    exports: playerExports,
    ...browser,
  });

  const hookExports = {};
  const hookPath = join(__dirname, "useAttendanceVoice.js");
  runInNewContext(readFileSync(hookPath, "utf8"), {
    exports: hookExports,
    ...browser,
    document,
    localStorage: {
      getItem: (key: string) => preferences.get(key) ?? null,
      setItem: (key: string, value: string) => preferences.set(key, value),
    },
    require: (name: string) => {
      if (name === "react") {
        return {
          useState: (initialValue: unknown) => {
            const index = cursor++;
            if (!state.has(index)) {
              state.set(
                index,
                typeof initialValue === "function"
                  ? initialValue()
                  : initialValue,
              );
            }
            return [
              state.get(index),
              (next: unknown) => {
                if (!mounted) updatesAfterUnmount++;
                state.set(
                  index,
                  typeof next === "function" ? next(state.get(index)) : next,
                );
              },
            ];
          },
          useRef: (initialValue: unknown) => {
            const index = cursor++;
            if (!refs.has(index)) refs.set(index, { current: initialValue });
            return refs.get(index);
          },
          useEffect: (
            callback: () => (() => void) | void,
            dependencies: unknown[],
          ) => {
            const index = cursor++;
            const previous = effects.get(index);
            if (
              previous &&
              dependencies.length === previous.dependencies.length &&
              dependencies.every((value, position) =>
                Object.is(value, previous.dependencies[position]),
              )
            )
              return;
            scheduledEffects.push(() => {
              previous?.cleanup?.();
              const cleanup = callback();
              effects.set(index, {
                dependencies,
                cleanup: cleanup || undefined,
              });
            });
          },
        };
      }
      if (name === "../../../process/students/voice") {
        return {
          loadStudentVoice: async (groupId: string, studentId: string) => {
            reads.push({ groupId, studentId });
            return records.get(studentId) ?? null;
          },
          subscribeStudentVoices: (listener: () => void) => {
            cacheListeners.add(listener);
            return () => cacheListeners.delete(listener);
          },
          prepareStudentVoice: () => {
            generationRequests++;
            throw new Error("Attendance must not generate speech.");
          },
        };
      }
      if (name === "../../../process/attendance/voicePlayer")
        return playerExports;
      throw new Error(`Unexpected attendance dependency: ${name}`);
    },
  });
  const hookModule = hookExports as typeof import("./useAttendanceVoice");

  return {
    records,
    plays,
    audioInstances,
    createdUrls,
    revokedUrls,
    reads,
    preferences,
    render: (students = roster) => {
      roster = students;
      cursor = 0;
      scheduledEffects = [];
      const result = Reflect.apply(hookModule.useAttendanceVoice, undefined, [
        "ladybugs",
        roster,
      ]);
      scheduledEffects.forEach((effect) => effect());
      return result as ReturnType<typeof hookModule.useAttendanceVoice>;
    },
    publish: () => cacheListeners.forEach((listener) => listener()),
    hide: () => {
      document.hidden = true;
      documentListeners.get("visibilitychange")?.();
    },
    unmount: () => {
      mounted = false;
      effects.forEach((effect) => effect.cleanup?.());
    },
    assertNoGeneration: () => {
      assert.equal(
        generationRequests,
        0,
        "Attendance generated a new recording.",
      );
      assert.equal(networkRequests, 0, "Attendance fetched a recording.");
    },
    assertCleanUnmount: () => {
      assert.equal(updatesAfterUnmount, 0);
      assert.equal(cacheListeners.size, 0);
      assert.equal(documentListeners.size, 0);
    },
  };
};

test("present and absent play their exact saved Blobs without generation or another read", async () => {
  const voice = savedVoice();
  const app = setup(voice);
  app.render();
  await flush();
  const hook = app.render();
  const loadedReads = app.reads.length;
  hook.announce({ ...student, fullName: "  Ana   Maria " }, "present");
  hook.announce(student, "absent");
  assert.equal(app.createdUrls[0].blob, voice.present);
  assert.equal(app.createdUrls[1].blob, voice.absent);
  assert.deepEqual(
    app.plays.map((play) => play.src),
    app.createdUrls.map((item) => item.url),
  );
  assert.equal(app.reads.length, loadedReads);
  assert.equal(app.render().error, null);
  app.assertNoGeneration();
  app.unmount();
});

test("missing, stale, preparing, failed, and incomplete recordings never fall back to generation", async () => {
  const cases: Array<StudentVoice | null> = [
    null,
    savedVoice("Ana's previous name"),
    { ...savedVoice(), state: "preparing" },
    { ...savedVoice(), state: "error" },
    { ...savedVoice(), absent: undefined },
  ];
  for (const voice of cases) {
    const app = setup(voice);
    app.render();
    await flush();
    app.render().announce(student, "absent");
    assert.equal(app.render().error, "missing");
    assert.equal(app.plays.length, 0);
    assert.equal(app.createdUrls.length, 0);
    app.assertNoGeneration();
    app.unmount();
  }
});

test("a renamed child cannot play the prior name while refreshed cache reads are pending", async () => {
  const app = setup(savedVoice());
  app.render();
  await flush();
  app.render().announce(student, "present");
  const renamed = { ...student, fullName: "Ana Popescu" };
  app.render([renamed]).announce(renamed, "present");
  assert.equal(app.render().error, "missing");
  assert.equal(app.plays.length, 1);
  assert.deepEqual(app.revokedUrls, [app.createdUrls[0].url]);
  app.assertNoGeneration();
  app.unmount();
  await flush();
  app.assertCleanUnmount();
});

test("rapid attendance clicks stop older clips and ignore their delayed playback failures", async () => {
  const app = setup(savedVoice());
  app.render();
  await flush();
  app.render().announce(student, "present");
  const staleError = app.audioInstances[0].onerror;
  const staleEnded = app.audioInstances[0].onended;
  app.render().announce(student, "absent");
  app.plays[0].reject(new Error("Interrupted by a newer attendance click."));
  app.audioInstances[0].error = new Error("Delayed error from the first clip.");
  staleError?.();
  staleEnded?.();
  await flush();
  assert.equal(app.render().error, null);
  assert.equal(app.audioInstances[0].src, app.createdUrls[1].url);
  assert.deepEqual(app.revokedUrls, [app.createdUrls[0].url]);
  app.plays[1].reject(new Error("Current playback failed."));
  await flush();
  assert.equal(app.render().error, "playback");
  assert.deepEqual(
    app.revokedUrls,
    app.createdUrls.map((item) => item.url),
  );
  app.assertNoGeneration();
  app.unmount();
});

test("muting immediately releases audio, persists the choice, and suppresses stale errors", async () => {
  const app = setup(savedVoice());
  app.render();
  await flush();
  app.render().announce(student, "present");
  app.render().toggle();
  assert.equal(app.render().enabled, false);
  assert.equal(
    app.preferences.get("buburuzele:attendance-voice-enabled"),
    "false",
  );
  assert.equal(app.audioInstances[0].src, "");
  assert.deepEqual(app.revokedUrls, [app.createdUrls[0].url]);
  app.plays[0].reject(new Error("Playback was muted."));
  await flush();
  app.render().announce(student, "absent");
  assert.equal(app.plays.length, 1);
  assert.equal(app.render().error, null);
  app.assertNoGeneration();
  app.unmount();
});

test("hiding or leaving the page releases every object URL without stale error updates", async () => {
  const app = setup(savedVoice());
  app.render();
  await flush();
  app.render().announce(student, "present");
  app.hide();
  app.plays[0].reject(new Error("The page was hidden."));
  await flush();
  assert.equal(app.render().error, null);
  assert.equal(app.audioInstances[0].src, "");
  app.render().announce(student, "absent");
  app.unmount();
  app.plays[1].reject(new Error("The page was unmounted."));
  await flush();
  assert.deepEqual(
    app.revokedUrls,
    app.createdUrls.map((item) => item.url),
  );
  app.assertNoGeneration();
  app.assertCleanUnmount();
});

test("newly prepared recordings become playable via cache subscription and release on completion", async () => {
  const app = setup();
  app.render();
  await flush();
  app.render().announce(student, "present");
  assert.equal(app.render().error, "missing");
  const voice = savedVoice();
  app.records.set(student.id, voice);
  app.publish();
  await flush();
  app.render().announce(student, "present");
  assert.equal(app.createdUrls[0].blob, voice.present);
  app.audioInstances[0].onended?.();
  assert.equal(app.audioInstances[0].src, "");
  assert.deepEqual(app.revokedUrls, [app.createdUrls[0].url]);
  assert.equal(app.render().error, null);
  app.assertNoGeneration();
  app.unmount();
});
