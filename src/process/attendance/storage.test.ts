import test from "node:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";

import type { AttendanceStatuses } from "./types";

// Model idb-keyval's atomic update transactions with isolated, cloned records.
const setup = () => {
  const values = new Map<string, unknown>();
  let pending = Promise.resolve();
  let rejectNextCommit = false;
  let rejectNextRead = false;
  const idb = {
    get: async (key: string) => {
      if (rejectNextRead) {
        rejectNextRead = false;
        throw new Error("IndexedDB is unavailable.");
      }
      return structuredClone(values.get(key));
    },
    update: (key: string, updater: (value: unknown) => unknown) => {
      const result = pending.then(() => {
        const updated = updater(structuredClone(values.get(key)));
        if (rejectNextCommit) {
          rejectNextCommit = false;
          throw new Error("Storage quota exceeded.");
        }
        values.set(key, structuredClone(updated));
      });
      pending = result.catch(() => {});
      return result;
    },
  };
  const storagePath = join(__dirname, "storage.js");
  const requireCompiled = createRequire(storagePath);
  const exports = {};
  runInNewContext(readFileSync(storagePath, "utf8"), {
    exports,
    require: (name: string) =>
      name === "idb-keyval" ? idb : requireCompiled(name),
  });

  return {
    repository: exports as typeof import("./storage"),
    values,
    rejectNextCommit: () => {
      rejectNextCommit = true;
    },
    rejectNextRead: () => {
      rejectNextRead = true;
    },
  };
};

const groupId = "ladybugs";
const dateKey = "2026-09-10";
const storedKey = "buburuzele:attendance:ladybugs:2026-09-10";

test("a new day has no seeded attendance and reading does not create a record", async () => {
  const { repository, values } = setup();
  assert.deepEqual(
    structuredClone(await repository.loadAttendance(groupId, dateKey)),
    {
      statuses: {},
      savedAt: null,
    },
  );
  assert.equal(values.size, 0);
});

test("concurrent confirmations merge only changed students and isolate groups and days", async () => {
  const { repository } = setup();
  await repository.saveAttendanceRecord(groupId, dateKey, { ana: "present" });
  await Promise.all([
    repository.saveAttendanceRecord(groupId, dateKey, { ioana: "absent" }),
    repository.saveAttendanceRecord(groupId, dateKey, { andrei: "present" }),
    repository.saveAttendanceRecord("bees", dateKey, { ana: "absent" }),
    repository.saveAttendanceRecord(groupId, "2026-09-11", {
      ana: "unverified",
    }),
  ]);

  const record = await repository.loadAttendance(groupId, dateKey);
  assert.deepEqual(structuredClone(record.statuses), {
    ana: "present",
    ioana: "absent",
    andrei: "present",
  });
  assert.equal(typeof record.savedAt, "string");
  assert.equal(new Date(record.savedAt!).toISOString(), record.savedAt);
  assert.equal(
    (await repository.loadAttendance("bees", dateKey)).statuses.ana,
    "absent",
  );
  assert.equal(
    (await repository.loadAttendance(groupId, "2026-09-11")).statuses.ana,
    "unverified",
  );
});

test("explicit unverified status resets one student while preserving unrelated attendance", async () => {
  const { repository } = setup();
  await repository.saveAttendanceRecord(groupId, dateKey, {
    ana: "present",
    ioana: "absent",
  });
  await repository.saveAttendanceRecord(groupId, dateKey, {
    ana: "unverified",
  });
  assert.deepEqual(
    structuredClone(
      (await repository.loadAttendance(groupId, dateKey)).statuses,
    ),
    {
      ana: "unverified",
      ioana: "absent",
    },
  );
});

test("a submitted draft is captured before the caller edits it again", async () => {
  const { repository } = setup();
  const draft: AttendanceStatuses = { ana: "present" };
  const save = repository.saveAttendanceRecord(groupId, dateKey, draft);
  draft.ana = "absent";
  await save;
  assert.equal(
    (await repository.loadAttendance(groupId, dateKey)).statuses.ana,
    "present",
  );
});

test("encoded group identifiers cannot collide with each other", async () => {
  const { repository } = setup();
  await repository.saveAttendanceRecord("ladybugs:blue", dateKey, {
    ana: "present",
  });
  await repository.saveAttendanceRecord("ladybugs%3Ablue", dateKey, {
    ana: "absent",
  });
  assert.equal(
    (await repository.loadAttendance("ladybugs:blue", dateKey)).statuses.ana,
    "present",
  );
  assert.equal(
    (await repository.loadAttendance("ladybugs%3Ablue", dateKey)).statuses.ana,
    "absent",
  );
});

test("invalid dates, groups, and status drafts never create records", async () => {
  const { repository, values } = setup();
  for (const invalidDate of [
    "2026-02-29",
    "2026-04-31",
    "2026-00-10",
    "2026-1-10",
    "0000-01-01",
    "09/10/2026",
  ]) {
    await assert.rejects(
      repository.loadAttendance(groupId, invalidDate),
      /date is invalid/,
    );
    await assert.rejects(
      repository.saveAttendanceRecord(groupId, invalidDate, {}),
      /date is invalid/,
    );
  }
  await assert.rejects(
    repository.saveAttendanceRecord("  ", dateKey, {}),
    /group is required/,
  );
  for (const invalid of [
    { ana: "late" },
    { " ": "present" },
    [],
    null,
    new Date(),
    new Map(),
  ]) {
    await assert.rejects(
      repository.saveAttendanceRecord(
        groupId,
        dateKey,
        invalid as unknown as AttendanceStatuses,
      ),
      /details are invalid/,
    );
  }
  assert.equal(values.size, 0);
  await repository.saveAttendanceRecord(groupId, "2028-02-29", {
    ana: "present",
  });
  assert.equal(values.size, 1);
});

test("unreadable, newer, or misplaced stored data is preserved on read and save", async () => {
  const valid = {
    version: 1,
    groupId,
    dateKey,
    statuses: { ana: "present" },
    savedAt: "2026-09-10T08:00:00.000Z",
  };
  for (const original of [
    "damaged-data",
    null,
    { ...valid, version: 2 },
    { ...valid, groupId: "bees" },
    { ...valid, dateKey: "2026-09-11" },
    { ...valid, statuses: { ana: "late" } },
    { ...valid, statuses: { "": "present" } },
    { ...valid, statuses: [] },
    { ...valid, statuses: new Date() },
    { ...valid, savedAt: "yesterday" },
    { ...valid, savedAt: null },
  ]) {
    const { repository, values } = setup();
    values.set(storedKey, original);
    await assert.rejects(
      repository.loadAttendance(groupId, dateKey),
      /could not be read/,
    );
    await assert.rejects(
      repository.saveAttendanceRecord(groupId, dateKey, { ioana: "present" }),
      /could not be read/,
    );
    assert.deepEqual(values.get(storedKey), original);
  }
});

test("failed commits and unavailable reads reject without changing saved attendance", async () => {
  const { repository, values, rejectNextCommit, rejectNextRead } = setup();
  await repository.saveAttendanceRecord(groupId, dateKey, { ana: "present" });
  const original = structuredClone(values.get(storedKey));

  rejectNextCommit();
  await assert.rejects(
    repository.saveAttendanceRecord(groupId, dateKey, { ana: "absent" }),
    /quota exceeded/,
  );
  assert.deepEqual(values.get(storedKey), original);
  rejectNextRead();
  await assert.rejects(
    repository.loadAttendance(groupId, dateKey),
    /unavailable/,
  );
  assert.deepEqual(values.get(storedKey), original);
  assert.equal(
    (await repository.loadAttendance(groupId, dateKey)).statuses.ana,
    "present",
  );
});

test("confirming an all-unverified roster stores a confirmation time", async () => {
  const { repository } = setup();
  const saved = await repository.saveAttendanceRecord(groupId, dateKey, {});
  assert.ok(saved.savedAt);
  assert.deepEqual(structuredClone(saved.statuses), {});
  assert.equal(
    (await repository.loadAttendance(groupId, dateKey)).savedAt,
    saved.savedAt,
  );
});
