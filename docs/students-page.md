# Students page

The students page is available at `/students` and from **Manage Students** on the Ladybugs welcome page. It follows the [approved second concept](concepts/students-page-v2.png), with a compact floral title panel, a shared roster frame, and individual ladybugs for the children. The welcome page continues to provide direct access to the calendar.

## Roster and editing

Each ladybug shows the student's full name, age, and date of birth. Full names wrap, and the responsive grid uses six columns on desktop, four on tablet, three on smaller screens, and two on mobile. Twenty-four students occupy four desktop rows, with normal page scrolling available for larger classes and shorter windows. Search filters by full name, ignoring capitalization and diacritics.

**Add student** opens the student editor. Selecting a ladybug or its three-dot options button opens the same editor directly. The editor accepts a full name, date of birth, and optional photo. Age is calculated automatically from the birth date, so teachers do not need to update it each year. Names and birth dates are required. Children must be at least two years old when added or edited; the date picker ends at the latest eligible local birth date, and the form explains the minimum age when a younger birth date is entered. Existing stored records remain readable.

Teachers can upload, replace, position, zoom, and remove the photo shown in the ladybug's face. The editor previews the same ladybug used on the roster. The default illustrated face is used when no photo is supplied. **Save student** adds a new record; **Save changes** applies edits. **Cancel**, the close button, and Escape leave the saved record unchanged. **Delete student** opens a confirmation inside the editor with the student's saved name. **Keep student** or Escape returns to editing, and **Yes, delete student** removes the record.

All interface text is available in English and Romanian, including age/count plural forms, editor controls, confirmations, and errors. `/students` manages the existing Ladybugs group; the app currently has one group.

## Storage and photos

Student records persist in this browser's IndexedDB under `buburuzele:students:ladybugs`. The versioned record stores each student's ID, full name, date of birth, and optional cropped photo. There is no prefilled roster. Data is local to this browser and device; it is not synchronized to a server or other devices.

Saves and deletions update the displayed roster only after storage succeeds. Storage errors offer retry, and invalid or unreadable stored records are not silently replaced. Updates use an atomic read-modify-write operation to preserve changes made by another open tab.

Photo uploads accept JPEG, PNG, and WebP files up to 10 MB. The editor keeps the original photo only in memory, then stores a 256 × 256 JPEG face crop without the original image metadata. The stored crop is used on the roster. Dates display as `DD.MM.YYYY`; age uses the current local date. A February 29 birthday advances on March 1 in years without February 29.

## Main files

- `src/ui/pages/Students/`: roster, ladybug presentation, and editor.
- `src/process/students/`: student records, storage, dates, and photo processing.
- `src/process/constants/navigation-paths.ts` and `src/ui/navigator/routes.tsx`: route registration.
- `src/process/locales/en/general.json` and `src/process/locales/ro/general.json`: localized student copy.

## Validation

The production build and TypeScript checks pass. ESLint has no errors; the scaffold's existing React Hook Form / React Compiler warning remains in `useValidatedForm.ts`.

Isolated Chromium checks cover navigation from Welcome, required fields and future birth dates, adding and editing, reload persistence, photo uploads and crop persistence, photo removal, invalid images, search including Romanian diacritics, deletion and cancellation, save/delete failures retaining data, keyboard focus, and Romanian copy. The 24-student roster was checked at 1536 × 1024, 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024, 390 × 844, and 320 × 720 without horizontal overflow. All four rows fit at the two largest desktop sizes; shorter windows and mobile scroll normally.

Fourteen date and storage unit tests pass in both Europe/Bucharest and America/Los_Angeles. The storage tests use an isolated in-memory implementation of the `idb-keyval` atomic API contract; real IndexedDB persistence and write failures are exercised in Chromium. Corrupt/newer-data preservation is covered by the isolated unit tests.

Run the unit tests with Node 22 and the installed project dependencies:

```sh
node node_modules/typescript/bin/tsc --ignoreConfig --target ES2023 --module commonjs --moduleResolution node --ignoreDeprecations 6.0 --esModuleInterop --skipLibCheck --types node --outDir /tmp/buburuzele-student-tests src/process/students/dates.ts src/process/students/types.ts src/process/students/storage.ts src/process/students/dates.test.ts src/process/students/storage.test.ts
TZ=Europe/Bucharest node --test /tmp/buburuzele-student-tests/dates.test.js /tmp/buburuzele-student-tests/storage.test.js
TZ=America/Los_Angeles node --test /tmp/buburuzele-student-tests/dates.test.js /tmp/buburuzele-student-tests/storage.test.js
```
