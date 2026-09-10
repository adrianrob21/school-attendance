# Students page concept — version 2

Output: [Students page concept, version 2](concepts/students-page-v2.png).

Generation method: built-in `image_gen` tool.
Edit target and style reference: [Version 1](concepts/students-page-v1.png).

## Changes

- A shorter flower-decorated title panel leaves more room for the class.
- A full-width 6-column by 4-row roster shows 24 students in the desktop concept.
- Each ladybug displays the student's full name, age in completed years, and date of birth in `DD.MM.YYYY` format.
- The editor opens only when needed. Search and **Add student** remain above the roster.
- Optional photo faces and the default illustrated face remain available.
- The existing floral title and shared body frame retain their watercolor styling.

## Intended interactions

**Add student** opens a dialog with **Full name**, **Date of birth**, an automatically calculated read-only **Age**, and optional **Upload photo**. Saving adds the student to the class.

Selecting a ladybug opens the same dialog populated with that student's details. The teacher can update the full name or birth date, upload/replace/remove the photo, and position and zoom its circular face crop. **Save changes** applies the edits. Closing without saving preserves the saved values.

The three-dot menu exposes **Edit student**, **Change photo**, and **Delete student**. Deleting asks for confirmation with the student's full name before removing them.

Age is derived from date of birth and the current date; it is not separately entered or stored. Future birth dates are invalid. Age updates on birthdays. The concept's sample ages are calculated as of **10 September 2026**.

Full names wrap rather than truncate. The roster scrolls for larger classes and uses fewer columns at narrower widths; readable text and usable controls take priority over a fixed column count. Search matches students' full names.

All names, dates, and photo portraits are fictional examples. This is a revised visual concept, not an implemented application change.

## Sample data

| Full name | Age on 10 Sep 2026 | Date of birth |
| --- | --- | --- |
| Sofia Popescu | 5 | 14.03.2021 |
| Andrei Ionescu | 5 | 22.06.2021 |
| Maria Dumitru | 4 | 08.11.2021 |
| Luca Stan | 4 | 03.02.2022 |
| Emma Radu | 5 | 19.05.2021 |
| Matei Pavel | 4 | 27.09.2021 |
| Ana Marin | 4 | 11.01.2022 |
| David Ilie | 5 | 06.07.2021 |
| Eva Tudor | 4 | 24.04.2022 |
| Noah Dobre | 5 | 15.12.2020 |
| Mia Petrescu | 5 | 30.08.2021 |
| Vlad Georgescu | 4 | 02.10.2021 |
| Sara Enache | 4 | 17.02.2022 |
| Tudor Munteanu | 5 | 09.06.2021 |
| Ilinca Voicu | 4 | 21.03.2022 |
| Radu Oprea | 5 | 12.11.2020 |
| Daria Stoica | 5 | 05.05.2021 |
| Eric Sandu | 4 | 28.01.2022 |
| Iris Neagu | 5 | 16.07.2021 |
| Paul Dinu | 4 | 04.04.2022 |
| Clara Nistor | 4 | 23.09.2021 |
| Victor Barbu | 5 | 10.02.2021 |
| Mara Coman | 4 | 31.10.2021 |
| Alex Dobre | 4 | 07.06.2022 |

## Generation prompt

```text
Use case: ui-mockup.
Asset type: revised desktop Students page concept, version 2, for the existing Ladybugs kindergarten attendance app.
Input image: students-page-v1.png is the EDIT TARGET and exact visual-style reference.
Primary request: revise this page to fit MANY MORE STUDENTS and display each student's FULL NAME, AGE, and DATE OF BIRTH. Preserve the distinctive watercolor meadow, ladybug/photo concept, flower-decorated title plaque and large cream-blush body frame.

Output one complete high-fidelity landscape desktop webpage, same 3:2 ratio as the reference, rendered at high resolution for readable small typography. Prefer 2400 x 1600. No device mockup or browser chrome.

Changes:
- Make the top branding and floral title panel significantly shorter. The small "Kindergarten attendance" brand sits above a compact flower-trimmed plaque reading "Our little ladybugs". Remove the old subtitle to save vertical space. Keep "Back to group", corner leaves, pale blue clouds and smiling sun, but scale the scenery so it does not consume roster space.
- Enlarge the main body frame to occupy almost the entire remaining width and height: approximately x=90..2310 and y=305..1505 in a 2400 x 1600 canvas. Keep a softly rounded blush-peach rim, ivory paper center and a delicate inset border. Flowers hug exterior frame corners and cannot obscure data.
- REMOVE the permanently visible right-hand editor and its divider. The class grid uses the FULL width of the frame. The edit panel is closed in this view.
- A slim toolbar inside the frame shows "24 students" on the left, a modest rounded search box with magnifier and placeholder "Search students" toward the right, and a coral pill "+ Add student" at the far right.
- Display EXACTLY 24 students in a STRICT 6-column by 4-row grid. All four rows and all names, ages and dates MUST be fully visible, without cropping. Arrange at consistent positions with equal cell heights. More students would scroll, but no extra cut-off fifth row in this screenshot.
- Each compact student entry contains a charming small watercolor ladybug on top, with full name in bold rounded dark brown directly underneath, then a smaller age line, then a smaller "DOB DD.MM.YYYY" line. These three text lines must be clear, correctly spelled and readable. Give the names priority; no truncation or ellipses in names. Reserve up to two lines for long names in the design, although these sample names can fit on one line. Compact cream nameplates / very faint scalloped backing are acceptable, but avoid a dense stack of heavy bordered rectangular cards. All ladybugs belong to the ONE shared roster frame.
- At 2400 x 1600, each ladybug is roughly 160 x 108 px, full name around 28 px, metadata around 22 px. Keep generous gutters and avoid giant bugs. Their face crops must still be recognizable.
- Preserve exactly the reference's illustrated red spotted body, black head rim, antennae, tiny legs and friendly character. About half of the students have DIFFERENT natural smiling fictional child photo faces neatly masked into the ladybug's face opening. The remaining students have the default cream illustrated smiling mascot face; some show a tiny camera badge. Photo faces remain clearly photographic, no cartoon facial features layered over them, no human bodies, no unsettling biological hybrid. Use varied fictional portrait faces, not a repeated photo.
- A quiet three-dot menu at the top-right of each entry gives access to photo editing and removal. Menus are closed in this screenshot. Make them subtle, without competing with names and facts.
- At the very bottom INSIDE the body frame, a short subtle centered hint: "Select a ladybug to edit details or photo." Keep it separate from the final student's date line.

Exact student data, arranged in reading order. Every entry MUST contain all three strings exactly; the numeric dates use day.month.year. Ages are correct as of 10 September 2026:
Row 1, left to right:
- "Sofia Popescu" / "5 years" / "DOB 14.03.2021"
- "Andrei Ionescu" / "5 years" / "DOB 22.06.2021"
- "Maria Dumitru" / "4 years" / "DOB 08.11.2021"
- "Luca Stan" / "4 years" / "DOB 03.02.2022"
- "Emma Radu" / "5 years" / "DOB 19.05.2021"
- "Matei Pavel" / "4 years" / "DOB 27.09.2021"

Row 2, left to right:
- "Ana Marin" / "4 years" / "DOB 11.01.2022"
- "David Ilie" / "5 years" / "DOB 06.07.2021"
- "Eva Tudor" / "4 years" / "DOB 24.04.2022"
- "Noah Dobre" / "5 years" / "DOB 15.12.2020"
- "Mia Petrescu" / "5 years" / "DOB 30.08.2021"
- "Vlad Georgescu" / "4 years" / "DOB 02.10.2021"

Row 3, left to right:
- "Sara Enache" / "4 years" / "DOB 17.02.2022"
- "Tudor Munteanu" / "5 years" / "DOB 09.06.2021"
- "Ilinca Voicu" / "4 years" / "DOB 21.03.2022"
- "Radu Oprea" / "5 years" / "DOB 12.11.2020"
- "Daria Stoica" / "5 years" / "DOB 05.05.2021"
- "Eric Sandu" / "4 years" / "DOB 28.01.2022"

Row 4, left to right:
- "Iris Neagu" / "5 years" / "DOB 16.07.2021"
- "Paul Dinu" / "4 years" / "DOB 04.04.2022"
- "Clara Nistor" / "4 years" / "DOB 23.09.2021"
- "Victor Barbu" / "5 years" / "DOB 10.02.2021"
- "Mara Coman" / "4 years" / "DOB 31.10.2021"
- "Alex Dobre" / "4 years" / "DOB 07.06.2022"

Exact remaining UI text: "Kindergarten attendance"; "Back to group"; "Our little ladybugs"; "24 students"; "Search students"; "+ Add student"; "Select a ladybug to edit details or photo."

Preserve: watercolor paper texture; warm cream, muted peach, coral and meadow green palette; rounded DynaPuff-like dark brown headings; painted flowers at the title ends and exterior corners; polished cozy nursery storybook visual identity; functional legible UI.
Avoid: permanent editor sidebar, oversized title, excessive empty margins, oversized individual bugs, missing birth dates or ages, truncated names, generic dashboard table, attendance status or date controls, extra students, irrelevant icons, illegible lettering, annotation labels, watermark.
Priority order: 24 complete readable student entries with full name + age + DOB; optional faces integrated in ladybugs; floral title and body frames; same established visual style.
```

