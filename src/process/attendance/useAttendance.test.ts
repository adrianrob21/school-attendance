import test from "node:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";

import type { AttendanceRecord, AttendanceStatuses } from "./types";

const deferredRecord = () => {
  let resolve!: (value: AttendanceRecord) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<AttendanceRecord>(
    (resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    },
  );
  return { promise, resolve, reject };
};

// Keep React subscription plumbing inert to exercise the hook's shared store
// and competing asynchronous operations deterministically.
const setup = () => {
  const reads: Array<
    ReturnType<typeof deferredRecord> & { groupId: string; dateKey: string }
  > = [];
  const writes: Array<
    ReturnType<typeof deferredRecord> & {
      groupId: string;
      dateKey: string;
      changes: AttendanceStatuses;
    }
  > = [];
  const hookPath = join(__dirname, "useAttendance.js");
  const requireCompiled = createRequire(hookPath);
  const exports = {};
  runInNewContext(readFileSync(hookPath, "utf8"), {
    exports,
    Error,
    require: (name: string) => {
      if (name === "react")
        return {
          useCallback: (callback: unknown) => callback,
          useEffect: () => {},
          useSyncExternalStore: (
            _subscribe: unknown,
            getSnapshot: () => unknown,
          ) => getSnapshot(),
        };
      if (name === "./storage")
        return {
          loadAttendance: (groupId: string, dateKey: string) => {
            const deferred = deferredRecord();
            reads.push({ groupId, dateKey, ...deferred });
            return deferred.promise;
          },
          saveAttendanceRecord: (
            groupId: string,
            dateKey: string,
            changes: AttendanceStatuses,
          ) => {
            const deferred = deferredRecord();
            writes.push({ groupId, dateKey, changes, ...deferred });
            return deferred.promise;
          },
        };
      return requireCompiled(name);
    },
  });
  return { ...(exports as typeof import("./useAttendance")), reads, writes };
};

const confirmed = (statuses: AttendanceStatuses): AttendanceRecord => ({
  statuses,
  savedAt: "2026-09-10T08:00:00.000Z",
});

test("an older read cannot replace the result of a newer reload", async () => {
  const { useAttendance, reads } = setup();
  const hook = useAttendance("ladybugs", "2026-09-10");
  const oldReload = hook.reload();
  const newReload = hook.reload();
  reads[1].resolve(confirmed({ ana: "present" }));
  await newReload;
  reads[0].resolve(confirmed({ ana: "absent" }));
  await oldReload;
  assert.equal(useAttendance("ladybugs", "2026-09-10").statuses.ana, "present");
  assert.equal(useAttendance("ladybugs", "2026-09-10").isLoading, false);
});

test("a confirmed save invalidates pending reads and survives their later failure", async () => {
  const { useAttendance, reads, writes } = setup();
  const hook = useAttendance("ladybugs", "2026-09-10");
  const reload = hook.reload();
  const save = hook.saveAttendance({ ana: "present" });
  writes[0].resolve(confirmed({ ana: "present", ioana: "absent" }));
  await save;
  reads[0].reject(new Error("Delayed read failure."));
  await reload;
  const snapshot = useAttendance("ladybugs", "2026-09-10");
  assert.equal(snapshot.statuses.ana, "present");
  assert.equal(snapshot.statuses.ioana, "absent");
  assert.equal(snapshot.error, null);
  assert.ok(snapshot.savedAt);
});

test("pending saves publish to their original group and date after navigation", async () => {
  const { useAttendance, writes } = setup();
  const first = useAttendance("ladybugs", "2026-09-10");
  const save = first.saveAttendance({ ana: "present" });
  const nextDay = useAttendance("ladybugs", "2026-09-11");
  const nextGroup = useAttendance("bees", "2026-09-10");
  writes[0].resolve(confirmed({ ana: "present" }));
  await save;
  assert.equal(nextDay.savedAt, null);
  assert.equal(nextGroup.savedAt, null);
  assert.equal(useAttendance("ladybugs", "2026-09-11").statuses.ana, undefined);
  assert.equal(useAttendance("bees", "2026-09-10").statuses.ana, undefined);
  assert.equal(useAttendance("ladybugs", "2026-09-10").statuses.ana, "present");
});

test("a failed save keeps the last confirmed snapshot and rejects for the page to handle", async () => {
  const { useAttendance, reads, writes } = setup();
  const hook = useAttendance("ladybugs", "2026-09-10");
  const reload = hook.reload();
  reads[0].resolve(confirmed({ ana: "present" }));
  await reload;
  const save = hook.saveAttendance({ ana: "absent" });
  writes[0].reject(new Error("Storage quota exceeded."));
  await assert.rejects(save, /quota exceeded/);
  assert.equal(useAttendance("ladybugs", "2026-09-10").statuses.ana, "present");

  const failedReload = hook.reload();
  reads[1].reject(new Error("Storage unavailable."));
  await failedReload;
  const snapshot = useAttendance("ladybugs", "2026-09-10");
  assert.equal(snapshot.statuses.ana, "present");
  assert.equal(snapshot.isLoading, false);
  assert.match(snapshot.error!.message, /unavailable/);
});
