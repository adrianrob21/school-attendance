# Today's Page

The attendance page is available at `/today`, from **Take today's attendance** on the Ladybugs welcome page, and directly from every Calendar date at `/today?date=YYYY-MM-DD`, with no intermediate dialog. It follows the [approved attendance concept](concepts/todays-page-v1.png), using the existing watercolor meadow, floral title panel, and shared roster frame. The Calendar's **Today** button continues to return to the current month and date.

## Checking attendance

The page uses the same real student roster and photos as Manage Students. There is no example data or separate attendance roster. Each ladybug shows the student's full name, a status label below the name, and a separate happy face, sad face, or question mark on the right. Every student has exactly two attendance buttons: **Present** and **Absent**. The selected button is visibly marked; students without a saved or selected status start as **Unverified**.

Every student also has a compact cake badge with their localized birth day and month. Its accessible label and tooltip provide the full birthdate. The badge is highlighted when the birthday matches the displayed attendance date, provided that the selected year is not before the student's birth year.

The checked count and attendance totals update as the teacher makes selections and always cover the whole class, including students on other pages. **Confirm Attendance** opens a compact review dialog with three expressive ladybugs: happy for Present, sad for Absent, and questioning for Unverified. Each ladybug has its own count and label. The dialog has a narrower layout, compact actions, and no floral corner decorations. **Keep checking**, the close button, or Escape returns to the draft. **Save attendance** saves the selections and closes the dialog after storage succeeds.

Unverified remains a distinct status. The dialog explicitly reports unchecked students, and saving leaves them unverified. It never treats unchecked students as absent. An empty roster offers a link to add the first student; loading and storage errors have separate states with retry.

## Saved Romanian attendance voice

Adding or saving a child starts preparation of two complete Romanian clips in the background: **“Name, prezent”** and **“Name, absent.”** The local Piper engine uses the **Raluca High** Romanian model (`ro_RO-raluca-high.onnx`) at `length_scale=1.12` with `noise_w_scale=0`. This model can omit the final consonants at a sentence boundary, even when the WAV file itself is complete. Preparation therefore synthesizes a following phrase, checks that the final **n** and **t** contain speech, and uses phoneme timings to remove the continuation at a quiet point after the complete status word. A 300-millisecond pause follows. No final consonant is faded or trimmed. If the word ending or a safe pause cannot be verified, preparation fails and exposes the existing retry action.

Both WAV clips are saved together in this browser's IndexedDB with the `raluca-high-v3` voice identity. An unchanged name reuses its current saved clips; a renamed child gets new clips. Earlier recordings are treated as unavailable and can be refreshed once with **Pregătește vocea** in the student list. Voice preparation failures do not undo the child's saved details.

The student list shows **Pregătim vocea…**, **Voce pregătită**, or a retry action. Existing children can use **Pregătește vocea** once. Interrupted preparation can be retried after reload. Deleting a child removes their clips, and a late generation response cannot restore deleted or superseded audio.

Attendance loads saved audio from IndexedDB and plays a local Blob URL directly on each click. **Attendance clicks never call a speech API, generate missing clips, or fetch remote audio.** Missing recordings link back to the student list. Audio playback works without a network connection once the app is open and the clips are saved. A compact **Cu voce / Fără voce** toggle remembers the teacher's choice. Quick clicks replace the previous clip; muting, navigation, and hiding the tab stop playback. The student list identifies the voice as synthetic.

### Voice setup

Run `npm run voice:setup` with Python 3.9+ and an internet connection. It creates a project-local `.venv`, installs `piper-tts[alignment]==1.8.0`, and downloads the Raluca model (about 114 MB) and configuration into `models/raluca/`. Rerun setup when upgrading from an earlier voice version to install its local ONNX alignment dependency. Model downloads use a pinned revision and verified SHA-256 checksums from `server/raluca-model.json`; verified downloads are reused. No API key or environment file is required. `.env.example` documents optional `PIPER_PYTHON` and `PIPER_MODEL` paths for an existing installation.

- Development: `npm start` includes the preparation endpoint.
- Preview: `npm run build`, then `npm run preview`.
- Production: `npm run build`, then `npm run serve`. The Node server serves the app and preparation endpoint; optional `HOST` and `PORT` control its address (defaults `127.0.0.1:3000`).
- `GET /api/student-voice/status` reports whether the local Python executable, model, and configuration are present; it never generates audio.
- `POST /api/student-voice` accepts only the name and returns both clips; it is called by student preparation only.

After installation, preparation requires only the app's local Node/Python server; synthesis makes no external requests. Python loads the model once for each child's pair of clips and runs on the CPU. Names are passed through standard input, never through a shell command. The endpoint limits simultaneous generation to two workers and combines duplicate in-flight requests. Existing saved clips require neither the server nor an API call to play. Clips remain in this browser and are not synchronized to other devices. The server does not persist generated audio.

The Raluca voice model is by **eduardem**, from [piper-tts-romanian](https://huggingface.co/eduardem/piper-tts-romanian), licensed [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Its weights and downloaded files are unchanged; Piper exposes phoneme timings by adding a graph output in memory. The [Piper engine](https://github.com/OHF-Voice/piper1-gpl) is GPL-3.0-or-later; integration follows its [Python API](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/API_PYTHON.md). Preserve attribution and the model's noncommercial terms when distributing it.

[Generated attendance samples](voice-samples/README.md) use the same model and settings. Automated tests cover backend validation, complete phoneme retention, quiet-pause selection, rejected unsafe output, cache migration, and attendance playback. A real-model sweep verified the final **n** and **t** plus a safe cut in 32 clips across 16 names, including names with initials, punctuation, and multiple parts. Independent offline recognition recovered the complete status words in the updated examples that previously lost their endings. Actual local synthesis and endpoint preparation returned finalized WAVs. Hook/player tests use browser mocks; the voice UI has not yet been checked in a live browser.

## Saving and dates

Attendance is stored in this browser's IndexedDB by group and device-local calendar date, under `buburuzele:attendance:<encoded-group-id>:YYYY-MM-DD`. Versioned records contain student IDs, attendance statuses, and the last confirmation time. Counts include only students in the current roster. The application currently opens the Ladybugs group. Saved attendance records remain local to this browser and device, with no cross-device synchronization. Preparing a child's voice uses the local Piper installation described above.

Selecting a status edits a draft. Records are written only after **Save attendance** in the confirmation dialog. Same-tab route navigation preserves unsaved drafts in memory. While the attendance page is open, unsaved changes register the browser's unload protection for closing or reloading the page; drafts are not persisted across a completed reload. Atomic saves merge the submitted changes with the existing record to preserve unrelated student changes from another tab.

Save failures retain both the draft and the last confirmed record, allowing retry. Read failures and invalid, misplaced, or newer stored records are surfaced as errors and are not silently replaced with empty attendance. Delayed reads cannot overwrite a newer successful save.

A valid `date` parameter selects the exact attendance day, survives reloads, and uses a date-specific record for both reads and saves. Invalid or missing date parameters fall back to today. Dates chosen explicitly show an Attendance heading and do not display the new-day banner merely because they differ from today. The Calendar link restores the chosen date and month.

For the default `/today` route, the attendance date stays pinned while the page is open. When the device's local date changes, a banner asks the teacher to save any edits for the original date before opening today's attendance. Date checks run periodically and when the window regains focus or visibility. The new day starts with its own attendance record.

## Layout and accessibility

The page fits the viewport without document scrolling. Roster ladybugs are 64 pixels wide, Present and Absent pills are 28 pixels tall, and the Confirm Attendance button is smaller. The separate Manage Students footer link has been removed to preserve room for attendance.

A `ResizeObserver` measures the available roster space and selects a capacity of one to six columns and one to four rows, with 135 pixels reserved per row. Previous/next page controls appear when the class exceeds that capacity. They keep every student reachable on small screens and short desktop windows. Changing pages preserves all draft selections, and summary counts always include the entire class. Names wrap within the compact entries.

Attendance buttons expose their student name and selected state. Text and separate expression icons communicate each status, with selection updates announced to assistive technology. The native modal provides focus containment, Escape dismissal, and focus restoration. Decorative art is hidden from assistive technology, and animation respects reduced-motion preferences. All interface copy is available in English and Romanian, including plural forms and errors.

## Main files

- `src/ui/pages/Today/`: attendance page, draft behavior, confirmation dialog, and expression components.
- `src/process/attendance/`: per-group/date records, storage, counts, and shared attendance state.
- `src/process/students/voice.ts`: saved voice clips and preparation lifecycle.
- `src/ui/pages/Students/StudentVoice/`: preparation status and retry controls.
- `server/studentVoice.mjs`, `server/piper_voice.py`, and `server/index.mjs`: local Raluca clip preparation and production app server.
- `server/setupVoice.mjs` and `server/raluca-model.json`: reproducible local engine/model installation and attribution.
- `src/ui/pages/Welcome/` and `src/ui/pages/Calendar/`: attendance entry points.
- `src/process/constants/navigation-paths.ts` and `src/ui/navigator/routes.tsx`: route registration.
- `src/process/locales/en/general.json` and `src/process/locales/ro/general.json`: attendance translations under `today`.

## Validation

The production build and TypeScript checks pass. ESLint has no errors; the existing React Hook Form / React Compiler warning remains in `useValidatedForm.ts`.

Fifteen attendance unit tests pass in both Europe/Bucharest and America/Los_Angeles. They cover counts, missing and explicit unverified statuses, independent groups and dates, atomic merges, corrupt-record preservation, failed reads and writes, captured drafts, and competing asynchronous reads and saves.

Isolated Chromium checks passed for the full attendance flow, summary counts, dialog cancellation and focus, draft route navigation, save/reload persistence, failed-save retry, corrupt-record preservation, previous-day isolation, midnight rollover, and date-specific attendance navigation from Calendar. No uncaught browser errors were recorded.

The compact revision passed desktop and phone checks for paging through all 24 students, birthday badges, retained selections, whole-class totals, and saving. Visual checks from 1536 down to 320 pixels wide, including an 844 × 390 landscape viewport, found no document or modal overflow. Every visible student remains inside the roster frame. The save-error modal also fits at 320 × 568 without scrolling.

Run the attendance unit tests with Node 22 and the installed project dependencies:

```sh
node node_modules/typescript/bin/tsc --ignoreConfig --target ES2023 --module commonjs --moduleResolution node --ignoreDeprecations 6.0 --esModuleInterop --skipLibCheck --types node --outDir /tmp/buburuzele-attendance-tests src/process/attendance/types.ts src/process/attendance/storage.ts src/process/attendance/counts.ts src/process/attendance/useAttendance.ts src/process/attendance/storage.test.ts src/process/attendance/counts.test.ts src/process/attendance/useAttendance.test.ts
TZ=Europe/Bucharest node --test /tmp/buburuzele-attendance-tests/storage.test.js /tmp/buburuzele-attendance-tests/counts.test.js /tmp/buburuzele-attendance-tests/useAttendance.test.js
TZ=America/Los_Angeles node --test /tmp/buburuzele-attendance-tests/storage.test.js /tmp/buburuzele-attendance-tests/counts.test.js /tmp/buburuzele-attendance-tests/useAttendance.test.js
```
