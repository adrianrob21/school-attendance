import test from "node:test";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";

import type { StudentDraft } from "./types";
import { getLatestStudentBirthDateInput, getTodayDateInput } from "./dates";

// Run the compiled repository with an isolated get/update implementation. The
// update queue models idb-keyval's atomic transaction contract, without a browser
// or an additional IndexedDB emulation dependency.
const setup = () => {
  const values = new Map<string, unknown>();
  let pending = Promise.resolve();
  let rejectNextCommit = false;
  const idb = {
    get: async (key: string) => structuredClone(values.get(key)),
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
    crypto: { randomUUID },
    require: (name: string) =>
      name === "idb-keyval" ? idb : requireCompiled(name),
  });

  return {
    repository: exports as typeof import("./storage"),
    values,
    rejectNextCommit: () => {
      rejectNextCommit = true;
    },
  };
};

const draft = (fullName: string): StudentDraft => ({
  fullName,
  dateOfBirth: "2021-09-10",
});

test("concurrent additions and removal preserve unrelated students and groups", async () => {
  const { repository } = setup();
  const first = await repository.saveStudentRecord(
    "ladybugs",
    draft("Ana Pop"),
  );
  await repository.saveStudentRecord("bees", draft("Mara Radu"));

  await Promise.all([
    repository.saveStudentRecord("ladybugs", draft("Andrei Ionescu")),
    repository.deleteStudentRecord("ladybugs", first.student.id),
    repository.saveStudentRecord("ladybugs", draft("Ioana Dumitru")),
  ]);

  assert.deepEqual(
    (await repository.loadStudents("ladybugs")).map(({ fullName }) => fullName),
    ["Andrei Ionescu", "Ioana Dumitru"],
  );
  assert.equal(
    (await repository.loadStudents("bees"))[0].fullName,
    "Mara Radu",
  );
});

test("editing a student preserves the ID and supports removing their photo", async () => {
  const { repository } = setup();
  const first = await repository.saveStudentRecord("ladybugs", {
    ...draft("  Ana   Maria Pop  "),
    photoDataUrl: "data:image/jpeg;base64,YQ==",
  });
  assert.equal(first.student.fullName, "Ana Maria Pop");

  await repository.saveStudentRecord("ladybugs", {
    ...draft("Ana Maria Popescu"),
    id: first.student.id,
  });
  const saved = await repository.loadStudents("ladybugs");
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, first.student.id);
  assert.equal(saved[0].fullName, "Ana Maria Popescu");
  assert.equal(saved[0].photoDataUrl, undefined);
});

test("a stale editor cannot recreate a student deleted from another session", async () => {
  const { repository } = setup();
  const first = await repository.saveStudentRecord(
    "ladybugs",
    draft("Ana Pop"),
  );
  await repository.deleteStudentRecord("ladybugs", first.student.id);

  await assert.rejects(
    repository.saveStudentRecord("ladybugs", first.student),
    /no longer exists/,
  );
  assert.equal((await repository.loadStudents("ladybugs")).length, 0);
});

test("failed save and deletion leave the previously persisted class intact", async () => {
  const { repository, rejectNextCommit } = setup();
  const first = await repository.saveStudentRecord(
    "ladybugs",
    draft("Ana Pop"),
  );

  rejectNextCommit();
  await assert.rejects(
    repository.saveStudentRecord("ladybugs", draft("Andrei Ionescu")),
    /quota exceeded/,
  );
  rejectNextCommit();
  await assert.rejects(
    repository.deleteStudentRecord("ladybugs", first.student.id),
    /quota exceeded/,
  );
  const saved = await repository.loadStudents("ladybugs");
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, first.student.id);
});

test("unreadable or newer persisted data is preserved when reading or mutating", async () => {
  for (const original of [
    "damaged-data",
    { version: 2, students: [] },
    { version: 1, students: [{ id: "incomplete-record" }] },
  ]) {
    const { repository, values } = setup();
    const key = "buburuzele:students:ladybugs";
    values.set(key, original);

    await assert.rejects(
      repository.loadStudents("ladybugs"),
      /could not be read/,
    );
    await assert.rejects(
      repository.saveStudentRecord("ladybugs", draft("Ana Pop")),
      /could not be read/,
    );
    await assert.rejects(
      repository.deleteStudentRecord("ladybugs", "incomplete-record"),
      /could not be read/,
    );
    assert.deepEqual(values.get(key), original);
  }
});

test("invalid names, birth dates and photo values never create a stored class", async () => {
  const { repository, values } = setup();
  for (const invalid of [
    draft("   "),
    draft("a".repeat(121)),
    { ...draft("Ana Pop"), dateOfBirth: "2021-02-29" },
    { ...draft("Ana Pop"), dateOfBirth: "9999-01-01" },
    { ...draft("Ana Pop"), photoDataUrl: "https://example.com/photo.jpg" },
  ]) {
    await assert.rejects(
      repository.saveStudentRecord("ladybugs", invalid),
      /details are invalid/,
    );
  }
  assert.equal(values.size, 0);
});

test("saving enforces the minimum age for additions and edits", async () => {
  const { repository, values } = setup();
  const dateOfBirth = getTodayDateInput();
  await assert.rejects(
    repository.saveStudentRecord("ladybugs", {
      ...draft("Ana Pop"),
      dateOfBirth,
    }),
    /at least 2 years old/,
  );
  assert.equal(values.size, 0);

  const first = await repository.saveStudentRecord("ladybugs", {
    ...draft("Ana Pop"),
    dateOfBirth: getLatestStudentBirthDateInput(),
  });
  const originalStudents = await repository.loadStudents("ladybugs");
  await assert.rejects(
    repository.saveStudentRecord("ladybugs", { ...first.student, dateOfBirth }),
    /at least 2 years old/,
  );
  assert.deepEqual(await repository.loadStudents("ladybugs"), originalStudents);
});

test("previously saved younger children stay readable and survive other saves", async () => {
  const { repository, values } = setup();
  const youngerStudent = {
    ...draft("Ana Pop"),
    id: "existing-younger-child",
    dateOfBirth: getTodayDateInput(),
  };
  values.set("buburuzele:students:ladybugs", {
    version: 1,
    students: [youngerStudent],
  });
  assert.deepEqual(await repository.loadStudents("ladybugs"), [youngerStudent]);

  await repository.saveStudentRecord("ladybugs", draft("Mara Radu"));
  const students = await repository.loadStudents("ladybugs");
  assert.equal(students.length, 2);
  assert.deepEqual(students[0], youngerStudent);
});
