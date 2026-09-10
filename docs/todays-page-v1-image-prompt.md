# Today's Page — attendance concept

Generated with the built-in `image_gen` tool. Final image: [Today's Page and confirmation modal](concepts/todays-page-v1.png).

Visual references: [Students page v2](concepts/students-page-v2.png) and [Welcome garden desktop v3](concepts/ladybugs-welcome-v3-garden-desktop.png). The concepts folder was reviewed before generation; there was no existing Today attendance concept.

The concept shows 24 sample students with Present and Absent buttons, a status label and a separate happy, sad, or question-mark indicator to the right. Confirm Attendance opens the illustrated review modal: 18 Present, 4 Absent, and 2 Unverified. Each count has its own expressive ladybug. Unverified remains a distinct status. The right-hand panel presents the modal as a separate screen state over a dimmed page.

## Generation prompt

```text
Use case: ui-mockup.
Create ONE high-fidelity landscape concept presentation image for the existing Ladybugs kindergarten attendance app, showing the new "Today's Page" AND the styled modal shown after clicking "Confirm Attendance". This is a new attendance-page variation of the reference design, not implementation code.
Reference image 1 students-page-v2.png: primary style reference and roster character reference. Reference image 2 ladybugs-welcome-v3-garden-desktop.png: supporting watercolor, paper, floral, typography and button style reference. Preserve the established cohesive illustrated visual identity.

COMPOSITION: Prefer 3840 x 2160, wide 16:9, high resolution for crisp small UI text. One tasteful concept board containing TWO DISTINCT SCREEN STATES. The left approximately 65 percent shows the complete attendance page undimmed. The right approximately 35 percent shows an enlarged preview of the confirmation MODAL centered over a softly dimmed, blurred miniature of the same attendance page, clearly an overlay/dialog rather than a permanent sidebar. Use a narrow warm-ivory gutter between states. At the top of each state, a small quiet label reads "Today's Page" and "Confirmation modal" respectively. No device frames, browser chrome, watermarks or technical annotations.

MAIN PAGE:
Use the reference's illustrated watercolor meadow framing, corner branches, blue clouds, happy golden sun, poppies, daisies, and soft green grass. Keep plants at outer edges and away from text. Same cream paper, peach double borders, softly rounded panels and rounded dark chocolate DynaPuff-like lettering, coral primary buttons.
Compact top brand reads "Kindergarten attendance". Left pill "Back to group". A short flower-trimmed cream title plaque reads exactly "Today's Page". Below in smaller brown text "Ladybugs · Thursday, 10 September 2026".
A single large ivory roster frame with blush-peach rim fills most of the page. Top row inside the frame: "24 students" at left, and a quiet progress note "22 of 24 checked" at right.
EXACTLY 24 student entries, arranged in a strict SIX-COLUMN by FOUR-ROW grid. No heavy individual card boxes. All 24 entries and the full bottom action bar must fit and be visible.
Every entry has the SAME repeated vertical hierarchy:
1. Small watercolor red-and-black spotted ladybug with black head, cream friendly face, antennae and tiny feet, matching reference. Use different fictional smiling child PHOTO faces in about one third of ladybugs; the rest have the default illustrated cream face. Keep photo expressions as natural smiling portraits.
2. Full student name in legible dark brown bold rounded text below the ladybug.
3. A compact status row BELOW THE NAME: exact status word left aligned ("Present", "Absent", or "Unverified"), with its separate small circular FACE badge at the RIGHT end of the same row. Present: sage green word and HAPPY SMILING FACE. Absent: muted rose word and SAD FROWNING FACE. Unverified: warm amber word and clear QUESTION MARK in a cream circle. Face badge must be separate from the main ladybug avatar; do not replace student photos with status symbols.
4. Under that status row, exactly TWO small pill buttons side by side, "Present" on the left and "Absent" on the right, present on EVERY student including already-checked students. Present button uses sage green, Absent button uses muted coral. Selected status button has a softly filled colored background with a stronger border; unselected button has cream background and a subtle colored outline. On Unverified entries BOTH buttons are unselected. No third attendance button.
Prioritize clear controls and labels over oversized ladybug art. No ages, DOB, edit menus or add-student buttons on this attendance view.

EXACT student reading order and states:
Row 1: Sofia Popescu — Present; Andrei Ionescu — Present; Maria Dumitru — Absent; Luca Stan — Present; Emma Radu — Present; Matei Pavel — Present.
Row 2: Ana Marin — Present; David Ilie — Absent; Eva Tudor — Present; Noah Dobre — Present; Mia Petrescu — Present; Vlad Georgescu — Present.
Row 3: Sara Enache — Present; Tudor Munteanu — Present; Ilinca Voicu — Present; Radu Oprea — Absent; Daria Stoica — Present; Eric Sandu — Present.
Row 4: Iris Neagu — Present; Paul Dinu — Absent; Clara Nistor — Present; Victor Barbu — Present; Mara Coman — Unverified; Alex Dobre — Unverified.
These total 18 Present, 4 Absent, 2 Unverified.

At the bottom INSIDE the roster frame, a separated footer: a subtle inline summary "18 Present · 4 Absent · 2 Unverified" and a large prominent coral pill labeled EXACTLY "Confirm Attendance", centered or toward the right. Keep all text above surrounding flowers, nothing cut off.

MODAL PREVIEW on the RIGHT:
Warm cream paper rounded modal with blush-peach double border, soft shadow, delicate small daisies and leaves decorating exterior corners. Underlying screen is visibly dimmed. A small circular close button with x at upper right.
Heading "Confirm Attendance" in bold dark brown rounded type.
Subtitle "Ladybugs · 10 September 2026".
Then THREE equally spaced summary columns in ONE horizontal row, each softly tinted rather than boxed heavily:
Column 1 pale sage tint: a HAPPY SMILING LADYBUG, big count "18", label "Present".
Column 2 pale blush tint: a SAD FROWNING LADYBUG, big count "4", label "Absent".
Column 3 pale honey tint: a QUESTIONING LADYBUG with raised eyebrow and a small "?" floating above its head, big count "2", label "Unverified".
These are THREE actual illustrated LADYBUG CHARACTERS matching the roster, NOT generic emoji or human face icons. Expressive but gentle, cute and readable. Each count directly belongs to its corresponding ladybug.
Underneath, a warm pale amber note with a small question-mark icon and the exact text "2 students are still unverified."
Then smaller supporting text "Unverified students stay unverified."
At the bottom two large rounded buttons: cream secondary "Keep checking" and coral primary "Save attendance". This is a review step before saving; no success message.
All labels and numbers must be crisp, correctly spelled, consistent and readable.

Style priorities: faithfully match reference ladybugs and cozy watercolor storybook world; functional readable teacher UI; clear Present/Absent buttons for every student; distinct right-side status face; accurate 18/4/2 counts; polished floral summary dialog. Avoid generic corporate dashboard styling, giant mascots crowding UI, overcrowded embellishment inside roster, missing entries, extra controls, duplicate names, inconsistent counts, distorted photo faces or illegible pseudo-text.
```

## Local refinement prompt

```text
Use case: precise-object-edit.
Edit this generated Today's Page concept image with ONLY the following small local corrections. Preserve the entire two-panel composition, watercolor meadow, all 24 names and ladybugs, every status label and badge, all counts 18/4/2, all typography, dimensions, layout, flowers, modal and remaining controls exactly.

Correct the Present/Absent BUTTON PAIRS for exactly these THREE students:
- David Ilie (row 2 column 2), status Absent.
- Radu Oprea (row 3 column 4), status Absent.
- Paul Dinu (row 4 column 2), status Absent.
For EACH of these three, the LEFT "Present" button must be UNSELECTED: warm cream fill, thin green outline, dark green text. The RIGHT "Absent" button must be SELECTED: softly filled coral-pink background, stronger coral-red border, dark red text. MATCH the existing correct Maria Dumitru button pair (row 1 column 3). All four Absent students should use the same selected Absent style.
Keep ALL eighteen Present entries' button styles exactly as they currently are (selected green Present, cream Absent). Keep the two Unverified entries' two buttons unselected.

One additional small correction only within the third count card of the RIGHT MODAL: the questioning ladybug over "2 Unverified" should have an ILLUSTRATED cream face with an inquisitive raised eyebrow and little curious mouth, matching the painted mascot identity of the adjacent happy and sad ladybugs. Remove the human hair/photo-like features from ONLY this modal mascot, and preserve its red spotted body, black head rim, antennae, position, size and floating question mark. The main roster student photo faces remain unchanged.

Do NOT regenerate or rearrange the design. Output the complete image, same aspect ratio and resolution. Everything outside these four localized regions must remain unchanged.
```

