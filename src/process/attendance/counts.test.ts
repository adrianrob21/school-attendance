import test from "node:test";
import assert from "node:assert/strict";

import { getAttendanceCounts } from "./counts";

test("counts the current roster with missing and explicit unverified statuses", () => {
  assert.deepEqual(
    getAttendanceCounts(["ana", "ioana", "andrei", "mara"], {
      ana: "present",
      ioana: "absent",
      andrei: "unverified",
      removed: "present",
    }),
    { present: 1, absent: 1, unverified: 2 },
  );
});

test("empty rosters count zero and duplicate roster IDs count once", () => {
  assert.deepEqual(getAttendanceCounts([], { removed: "absent" }), {
    present: 0,
    absent: 0,
    unverified: 0,
  });
  assert.deepEqual(
    getAttendanceCounts(["ana", "ana", "constructor"], { ana: "present" }),
    {
      present: 1,
      absent: 0,
      unverified: 1,
    },
  );
});
