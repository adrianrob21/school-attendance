# Seasonal calendar

The working calendar is available at `/calendar`, reached from the Ladybugs welcome page. It implements the [twelve approved visual directions](calendar-concept.md) as a live, responsive calendar.

## Experience

Every month has its own watercolor date marker: snowflakes, heart blossoms, crocuses, tulips, peonies, daisies, sunflowers, poppies, apples, pumpkins, acorns, and Christmas wreaths. Existing winter, spring, summer, and autumn scenery frames the page. Day illustrations retain opaque painted petals and number centers; an SVG color-key filter removes only the atlas’s near-white exterior paper instead of blending the whole marker with the path. The title, month picker, and seasonal legend icon use a separate set of natural seasonal illustrations with no number spaces. Number positions follow the measured cream centers of each date illustration. A continuous winding trail connects each actual date in chronological order, including February 29 in leap years. December continues through December 31.

The ladybug stands beside the device's local current date. Today and the selected date have no surrounding circles, and their circle legend entries have been removed. Returning from attendance preserves the selected date; the mascot remains beside today. The Today button returns to the current month and selects the current day. The local date refreshes on an interval, window focus, and visibility changes.

Previous/next controls navigate across years and use the same arrow design, mirrored for the previous direction, in both the calendar and month picker. The month heading opens a picker with all twelve illustrated months and an editable year from 1 to 9999. Month changes gently fade and slide the new trail into view. The calendar fills the available viewport and keeps enough row spacing for date artwork, weekday labels, and badges. Tablet and desktop layouts fit the viewport without scrolling at standard sizes. Phones and tall portrait tablets use four dates per sweep (up to eight rows); shorter tablets switch to five sweeps to use the available width. Shorter windows reduce decorative padding before allowing vertical scrolling, with minimum trail heights of 544px for compact layouts and 400px for wide layouts to keep all dates readable. Scrolling remains available only when the viewport cannot hold the controls and dates at usable sizes. The narrowest phones place Today on a separate toolbar row. Each date has a compact localized weekday abbreviation underneath, with the full weekday available on hover. The former “Follow the path and choose a day” hint has been removed. Navigation stays above the calendar trail. The repeated attendance-brand heading has been removed. All dates remain available; holidays do not imply closures or attendance status.

Valentine's Day (February 14) uses a floral heart wreath. Halloween (October 31) adds a friendly pumpkin and ghost; Christmas (December 25) adds a decorated tree. Each holiday has a text label and a mention in the date's accessible name. Long holiday labels shorten with an ellipsis on small screens, retaining the full name on hover and in the date's accessible name.

## Birthdays and attendance

Birthday indicators come from the existing Ladybugs student records stored in IndexedDB through `useStudents`. There is no example data in the application. A cupcake and balloon badge marks each birthday, with a count for multiple children on one date. Birthday and holiday decorations can coexist with the current-date ladybug, while current-date and selection information remains available to assistive technology. The separate monthly birthday summary has been removed.

Activating any date navigates immediately to the [attendance page](todays-page.md) at `/today?date=YYYY-MM-DD`. There is no day-details dialog. The chosen date determines which attendance record is loaded and saved, including past and future dates. The attendance page's Calendar link returns to the same month and preserves that date's selection. Calendar month navigation is also reflected in the URL so browser Back restores the month being viewed.

Birthday-loading and storage failures retain distinct states and a retry action on the calendar.

February 29 birthdays are displayed on February 29 in leap years; this calendar does not move them to a different date in other years. Birthdays are not displayed before the student's birth year.

The Calendar's **Today** button keeps its month-jump behavior. Attendance is checked and confirmed on the separate [Today's Page](todays-page.md).

## Accessibility and localization

Dates are real links in a chronological ordered list, with full localized date names, current-date and selection information, holiday labels, and birthday counts. Links support keyboard activation and opening attendance in a new tab. Decorative images are hidden from assistive technology. Focus indicators, native modal focus containment, Escape dismissal, and focus restoration are supported. The month picker rejects invalid years. Both English and Romanian strings are included. Hover, month changes, and dialog animation respect reduced-motion preferences.

## Assets and code

- `src/ui/pages/Calendar/index.tsx`: month navigation, trail, current-date marker, and student integration.
- `calendar.ts`: month themes, local date helpers, birthdays, holidays, and path geometry.
- `CalendarArt.tsx`: SVG crops of the shared generated watercolor day atlas.
- `TitleArt.tsx`: natural decorations shared by the title, month picker, and legend; the generated image and prompts are recorded in [the title asset notes](calendar-title-assets-image-prompt.md).
- `CalendarArrow.tsx`: shared mirrored navigation arrow for the calendar and month picker.
- `MonthPicker.tsx`: accessible month/year dialog. The former day-details dialog has been removed.
- `src/ui/pages/Today/index.tsx`: validates the optional date parameter and loads the corresponding attendance session.
- `public/assets/calendar/seasonal-markers.png`: one shared 1254 × 1254 image; generation prompts and display-crop coordinates are recorded in [the asset notes](calendar-assets-image-prompt.md).

## Verification

- Direct attendance navigation passes through the normal app router: no day modal, correct selected-date storage and reload, unchanged attendance on other dates, restored month/selection when returning, past/future/leap-day navigation, invalid-date fallback, keyboard Enter, and mobile tap. Default Today rollover also remains intact. No browser errors or failed requests were recorded.
- Historical-date follow-up checks confirm September 8 and 9 links, reloads, and return selections at desktop and phone sizes. Isolated attendance tests verify distinct present/absent records for both dates, with today remaining unverified; all sixteen attendance storage, totals, and hook tests pass.

- Production build with Node 22 and scoped calendar ESLint pass after the compact-layout revision.
- Twelve unit tests cover dates, leap years, birthday grouping, holidays, themes, and both path layouts. They pass in Europe/Bucharest and America/Los_Angeles.
- Isolated Chromium checks passed for all twelve month sequences, February 2028, December/January rollover, year boundaries and invalid inputs, Today versus selection, month-picker focus restoration, real stored birthday counts, birthday and holiday coexistence, corrupt-storage recovery, and Romanian strings. No browser errors or failed requests were recorded.
- Screenshot comparisons in all twelve themes confirm that hiding the trail changes zero pixels in the date centers, verifying opaque artwork.
- All twelve desktop themes were visually reviewed. The compact revision is checked at 1536×864, 1280×720, 1024×768, 768×1024, 390×844, and 320×568. Checks cover every month, viewport overflow, date visibility, 44-pixel minimum date targets, non-overlapping controls, and dialog focus restoration. Mobile visual checks include a shared birthday on Valentine’s Day and the current-date mascot.
- Weekday labels and date targets pass all 72 month/viewport combinations. The final 320×568 check also covers all twelve months and leap-year February in both English and Romanian: no label or target collisions. Short viewports now allow vertical scrolling to preserve those clearances. Picker and legend illustrations, mirrored arrows, month-animation replay, and reduced-motion behavior pass browser checks.

Run the date tests with:

```sh
node node_modules/typescript/bin/tsc --ignoreConfig --target ES2023 --module commonjs --moduleResolution node --ignoreDeprecations 6.0 --esModuleInterop --skipLibCheck --types node --outDir /tmp/buburuzele-calendar-tests src/ui/pages/Calendar/calendar.ts src/ui/pages/Calendar/calendar.test.ts src/ui/pages/Calendar/types.ts
TZ=Europe/Bucharest node --test /tmp/buburuzele-calendar-tests/ui/pages/Calendar/calendar.test.js
TZ=America/Los_Angeles node --test /tmp/buburuzele-calendar-tests/ui/pages/Calendar/calendar.test.js
```
