# Calendar concept image prompts

Generation method: built-in `image_gen` tool (no CLI fallback). All four concepts are 1536 × 1024 PNGs. Reference images: [students page v2](concepts/students-page-v2.png) for the visual language and page redesign, and the [ladybug mascot](../public/assets/mascots/ladybug.png) for character identity. Both references were visually inspected before generation.

The full design specification and final image links are in [calendar-concept.md](calendar-concept.md). Initial holiday drafts use the same layout specification as the floral concept. Halloween and Christmas receive a localized second revision to correct path arrows and remove extra slogan signs. Version 1 drafts remain available for reference.

## Generic — initial prompt

Output: [calendar-generic-v1.png](concepts/calendar-generic-v1.png).

```text
Use case: ui-mockup.
Create a polished illustrated calendar-page concept by transforming the provided kindergarten students-page reference. Input image 1 is the UI/style reference and redesign target: preserve its warm watercolor storybook illustration, creamy paper, delicate peach rounded framing, dark brown rounded friendly lettering, smiling sunshine and lush meadow border; replace the student list and student-management controls with the calendar described below. Input image 2 is the exact ladybug character reference: keep its recognizable red shell, black spots, black antennae, cream face, rosy cheeks and friendly smile.

Output a single complete desktop webpage concept, 1536x1024 landscape. This is a GENERIC FLORAL MONTH, JUNE 2026. It must feel like an inviting children's illustrated board-game journey through a garden. NOT a conventional calendar table: no weekday columns, no square date cells, no week headers. Use one visible continuous curved pale sandy garden trail making five generous smooth serpentine horizontal sweeps down a large open cream meadow panel. Place exactly 30 large separate watercolor flower heads ON the trail as the selectable numbered days. Alternate ivory daisies, blush pink blossoms and pale butter-yellow flowers; give each a wide light center with one large very legible dark date numeral.

Exact reading order along the continuous trail:
top sweep left to right: 1, 2, 3, 4, 5, 6
second sweep right to left: 7, 8, 9, 10, 11, 12
third sweep left to right: 13, 14, 15, 16, 17, 18
fourth sweep right to left: 19, 20, 21, 22, 23, 24
bottom sweep left to right: 25, 26, 27, 28, 29, 30.
The path joins 6 to 7 at the right, 12 to 13 at the left, 18 to 19 at the right and 24 to 25 at the left. Vary flower heights very gently along each sweep for a natural garden walk. Show every date exactly once, no extra numbered decoration. Tiny directional chevrons on the trail make the order intuitive.

At the top keep a small unobtrusive ladybug logo with exact text "Kindergarten attendance"; a cream pill at upper left reads "Back to group". Center the rounded dark-brown page heading "Our little days". Below it a restrained month navigation bar: left chevron, exact label "June 2026", right chevron, a small "Today" button. Small supporting line: "A little adventure, one day at a time."

TODAY: day 12 has a warm coral ring behind its flower. Place ONE charming larger ladybug mascot immediately BESIDE day 12 at the left turn, outside the numbered flower so neither date nor path is obscured. A small cream speech bubble says "Today!". Keep mascot scale modest (roughly 100px) to retain all neighboring dates.

BIRTHDAYS: day 8 and day 22 each retain their clearly visible flower and date number, with a small illustrated birthday cupcake with candle attached just outside the lower edge, two tiny pastel balloons rising beside it, and a neat cream tag saying "Birthday". This exact birthday system must stand apart from ordinary garden decoration. No child names, no student portraits, no invented attendance records.

At bottom of the panel add a discreet illustrated legend with three items: coral ring + "Today", cupcake + "Birthday", flower + "Choose a day". A light footer hint says "Follow the path and choose a day."
Composition: spacious, calm and highly readable; calendar journey dominates the page; edge decorations only, tiny daisies grass bushes at outer margins. Thin peach outline and soft paper shadow, no dark thick cartoon strokes, no photographic imagery, no 3D plastic, no phone/laptop frame, no floating dashboard cards or sidebar. Faithful high-quality watercolor children's-book visual language matching the reference, not a generic modern SaaS mockup.
```

## Valentines — initial prompt

Output: [calendar-valentines-v1.png](concepts/calendar-valentines-v1.png).

```text
Use case: ui-mockup.
Transform the provided kindergarten students-page UI into one complete illustrated CALENDAR webpage concept, 1536x1024 landscape. Input image 1 is the redesign target and visual reference. Preserve its beautiful watercolor children's-storybook visual language: subtle paper texture, warm ivory center, delicate peach rounded frame, dark brown rounded friendly lettering, soft foliage borders and charming small details. Remove all student portraits, student cards, search, and add-student controls. Input image 2 is the exact ladybug character reference; preserve recognizable red shell with black spots, black antennae, cream face, rosy cheeks and friendly smile.

SHARED PAGE: small header logo and "Kindergarten attendance"; a cream upper-left pill reading "Back to group"; large centered title "Our little days". Under title, previous chevron, the exact month label "February 2026", next chevron, and a small "Today" button. Supporting text: "A little adventure, one day at a time." Below, the page is dominated by a spacious illustrated board-game journey on open creamy paper. NO conventional calendar grid, NO weekday columns, NO week labels, NO square date cells, NO dashboard sidebar.

TRAIL GEOMETRY: one visible continuous gently curved pale sandy path snakes through five smooth sweeping horizontal switchbacks. Exactly 28 separate numbered seasonal objects sit ON this path, each with a wide quiet center and very legible dark-brown numeral. Position them generously with small variations in heights for an organic journey.
Exact chronological route:
Top sweep LEFT to RIGHT: 1, 2, 3, 4, 5, 6.
Second sweep RIGHT to LEFT: 7, 8, 9, 10, 11, 12.
Third sweep LEFT to RIGHT: 13, 14, 15, 16, 17, 18.
Fourth sweep RIGHT to LEFT: 19, 20, 21, 22, 23, 24.
Fifth sweep LEFT to RIGHT: 25, 26, 27, 28.
Smooth rounded turns connect 6 to 7 on right, 12 to 13 on left, 18 to 19 on right, and 24 to 25 on left. Tiny chevrons on the path clarify direction. All dates exactly once. No missing or duplicate numbers. No unrelated numbered decoration.

TODAY: a warm coral ring highlights day 12. ONE charming ladybug mascot stands immediately beside day 12 at the left turn, roughly 100px tall, with a small cream speech bubble "Today!". It must not obscure any numeral or overlap a neighboring date. Preserve the reference mascot identity.

BIRTHDAY SYSTEM: day 8 and day 22 keep their date numbers fully visible and their normal seasonal object. Attach a tiny illustrated cupcake with candle just outside each node, with two small pastel balloons beside it and a neat cream tag "Birthday". Birthday cupcakes are used only on these dates and the footer legend; use identical birthday symbols across seasonal themes. These birthdays must be clearly recognizable and different from holiday decorations. No child names or invented attendance records. Future dates remain bright and selectable, with no padlocks or completion checks.

BOTTOM: discreet legend, coral ring + "Today", cupcake + "Birthday", seasonal day object + "Choose a day"; a footer hint "Follow the path and choose a day." Spacious, readable and polished; scenery at outer margins, calm empty space between nodes. Faithful high-quality hand-painted watercolor visual design. No photographic imagery, 3D plastic, mockup devices, flat generic SaaS style, extra text or watermarks.

VALENTINE'S / FRIENDSHIP MONTH THEME: Every date is represented by a soft blush, coral, pink or pale-berry heart-shaped blossom, with big pale centers for numerals. Several are flower-like layered hearts with small sage leaves, no identical square cells. A delicate friendship garden: light rose bushes, heart-shaped leaves, tiny pink petals at borders, subtle warm winter sunlight. Keep the central ivory space bright and uncluttered. Day 14 has a slightly larger special heart-flower wreath and a small neat "Valentine's Day" ribbon below; date14 remains obvious. Include a small heart accent on the ladybug without changing its face or shell. Birthdays on8 and22 retain cupcakes and balloons, different from hearts. This is a sweet kindergarten celebration of kindness and friendship. Show all28 February dates.
```

## Halloween — initial prompt

Output: [calendar-halloween-v1.png](concepts/calendar-halloween-v1.png).

```text
Use case: ui-mockup.
Transform the provided kindergarten students-page UI into one complete illustrated CALENDAR webpage concept, 1536x1024 landscape. Input image 1 is the redesign target and visual reference. Preserve its beautiful watercolor children's-storybook visual language: subtle paper texture, warm ivory center, delicate peach rounded frame, dark brown rounded friendly lettering, soft foliage borders and charming small details. Remove all student portraits, student cards, search, and add-student controls. Input image 2 is the exact ladybug character reference; preserve recognizable red shell with black spots, black antennae, cream face, rosy cheeks and friendly smile.

SHARED PAGE: small header logo and "Kindergarten attendance"; a cream upper-left pill reading "Back to group"; large centered title "Our little days". Under title, previous chevron, the exact month label "October 2026", next chevron, and a small "Today" button. Supporting text: "A little adventure, one day at a time." Below, the page is dominated by a spacious illustrated board-game journey on open creamy paper. NO conventional calendar grid, NO weekday columns, NO week labels, NO square date cells, NO dashboard sidebar.

TRAIL GEOMETRY: one visible continuous gently curved pale sandy path snakes through five smooth sweeping horizontal switchbacks. Exactly 31 separate numbered seasonal objects sit ON this path, each with a wide quiet center and very legible dark-brown numeral. Position them generously with small variations in heights for an organic journey.
Exact chronological route:
Top sweep LEFT to RIGHT: 1, 2, 3, 4, 5, 6.
Second sweep RIGHT to LEFT: 7, 8, 9, 10, 11, 12.
Third sweep LEFT to RIGHT: 13, 14, 15, 16, 17, 18.
Fourth sweep RIGHT to LEFT: 19, 20, 21, 22, 23, 24.
Fifth sweep LEFT to RIGHT: 25, 26, 27, 28, 29, 30, 31.
Smooth rounded turns connect 6 to 7 on right, 12 to 13 on left, 18 to 19 on right, and 24 to 25 on left. Tiny chevrons on the path clarify direction. All dates exactly once. No missing or duplicate numbers. No unrelated numbered decoration.

TODAY: a warm coral ring highlights day 12. ONE charming ladybug mascot stands immediately beside day 12 at the left turn, roughly 100px tall, with a small cream speech bubble "Today!". It must not obscure any numeral or overlap a neighboring date. Preserve the reference mascot identity.

BIRTHDAY SYSTEM: day 8 and day 22 keep their date numbers fully visible and their normal seasonal object. Attach a tiny illustrated cupcake with candle just outside each node, with two small pastel balloons beside it and a neat cream tag "Birthday". Birthday cupcakes are used only on these dates and the footer legend; use identical birthday symbols across seasonal themes. These birthdays must be clearly recognizable and different from holiday decorations. No child names or invented attendance records. Future dates remain bright and selectable, with no padlocks or completion checks.

BOTTOM: discreet legend, coral ring + "Today", cupcake + "Birthday", seasonal day object + "Choose a day"; a footer hint "Follow the path and choose a day." Spacious, readable and polished; scenery at outer margins, calm empty space between nodes. Faithful high-quality hand-painted watercolor visual design. No photographic imagery, 3D plastic, mockup devices, flat generic SaaS style, extra text or watermarks.

HALLOWEEN / AUTUMN MONTH THEME: Every date is a softly rounded watercolor pumpkin, varying pale orange, creamy apricot and muted amber, with a generous light central face area for its dark date numeral. Small green stems and occasional amber leaves. Dates remain plain legible numerals; decorative pumpkin faces must not compete. Outer border has copper trees, fall leaves, a few tiny acorns and friendly mushrooms. Muted plum accents, warm cream sky with smiling autumn sunshine, cheerful daytime autumn garden. Day31, the final node at bottom right, is a special smiling jack-o-lantern with a small friendly ghost floating beside it and a neat ribbon "Halloween". Its numeral31 remains clearly visible. Ladybug beside12 may wear a tiny plum witch hat but preserve its face, shell and identity. No horror, frightening figures, skulls or gloomy black background. Birthday cupcakes and balloons on8 and22 remain explicit and visually distinct. Show all31 October dates.
```

## Christmas — initial prompt

Output: [calendar-christmas-v1.png](concepts/calendar-christmas-v1.png).

```text
Use case: ui-mockup.
Transform the provided kindergarten students-page UI into one complete illustrated CALENDAR webpage concept, 1536x1024 landscape. Input image 1 is the redesign target and visual reference. Preserve its beautiful watercolor children's-storybook visual language: subtle paper texture, warm ivory center, delicate peach rounded frame, dark brown rounded friendly lettering, soft foliage borders and charming small details. Remove all student portraits, student cards, search, and add-student controls. Input image 2 is the exact ladybug character reference; preserve recognizable red shell with black spots, black antennae, cream face, rosy cheeks and friendly smile.

SHARED PAGE: small header logo and "Kindergarten attendance"; a cream upper-left pill reading "Back to group"; large centered title "Our little days". Under title, previous chevron, the exact month label "December 2026", next chevron, and a small "Today" button. Supporting text: "A little adventure, one day at a time." Below, the page is dominated by a spacious illustrated board-game journey on open creamy paper. NO conventional calendar grid, NO weekday columns, NO week labels, NO square date cells, NO dashboard sidebar.

TRAIL GEOMETRY: one visible continuous gently curved pale sandy path snakes through five smooth sweeping horizontal switchbacks. Exactly 31 separate numbered seasonal objects sit ON this path, each with a wide quiet center and very legible dark-brown numeral. Position them generously with small variations in heights for an organic journey.
Exact chronological route:
Top sweep LEFT to RIGHT: 1, 2, 3, 4, 5, 6.
Second sweep RIGHT to LEFT: 7, 8, 9, 10, 11, 12.
Third sweep LEFT to RIGHT: 13, 14, 15, 16, 17, 18.
Fourth sweep RIGHT to LEFT: 19, 20, 21, 22, 23, 24.
Fifth sweep LEFT to RIGHT: 25, 26, 27, 28, 29, 30, 31.
Smooth rounded turns connect 6 to 7 on right, 12 to 13 on left, 18 to 19 on right, and 24 to 25 on left. Tiny chevrons on the path clarify direction. All dates exactly once. No missing or duplicate numbers. No unrelated numbered decoration.

TODAY: a warm coral ring highlights day 12. ONE charming ladybug mascot stands immediately beside day 12 at the left turn, roughly 100px tall, with a small cream speech bubble "Today!". It must not obscure any numeral or overlap a neighboring date. Preserve the reference mascot identity.

BIRTHDAY SYSTEM: day 8 and day 22 keep their date numbers fully visible and their normal seasonal object. Attach a tiny illustrated cupcake with candle just outside each node, with two small pastel balloons beside it and a neat cream tag "Birthday". Birthday cupcakes are used only on these dates and the footer legend; use identical birthday symbols across seasonal themes. These birthdays must be clearly recognizable and different from holiday decorations. No child names or invented attendance records. Future dates remain bright and selectable, with no padlocks or completion checks.

BOTTOM: discreet legend, coral ring + "Today", cupcake + "Birthday", seasonal day object + "Choose a day"; a footer hint "Follow the path and choose a day." Spacious, readable and polished; scenery at outer margins, calm empty space between nodes. Faithful high-quality hand-painted watercolor visual design. No photographic imagery, 3D plastic, mockup devices, flat generic SaaS style, extra text or watermarks.

CHRISTMAS / WINTER MONTH THEME: Every date is a round Christmas bauble or small evergreen wreath, alternating soft cranberry red, ivory, pale sage and snowy blue, each with large ivory/cream central area and a very readable dark numeral. Small metallic-gold ornament caps, delicate sprigs, tiny ribbons. The trail is a pale snowy walking path bordered by occasional pine needles. Outer borders have softly snow-covered fir branches, red berries, a few candy canes and warm fairy lights, a cheerful winter sky; ivory center remains uncluttered and numbers high contrast. Day25 on the bottom left has a small festive decorated Christmas tree beside its ornament and a neat "Christmas" ribbon below; date25 must stay obvious. The chronological path CONTINUES beyond Christmas through26,27,28,29,30,31 across the entire final row: it is a FULL31-DAY MONTH, not a24-day advent calendar. Ladybug beside12 wears a tiny Santa hat without changing its face or identity. Birthday cupcakes and balloons on8 and22 remain explicit and visually distinct from Christmas gifts. All31 December dates, no stopping at24 or25.
```

## Halloween — final localized refinement

Edit target: [version 1](concepts/calendar-halloween-v1.png). Final output: [version 2](concepts/calendar-halloween-v2.png).

```text
Use case: precise-object-edit. Make a very localized correction to the provided finished October calendar concept. Preserve the composition, every numbered pumpkin1 through31, all date positions, the ladybug at12, birthday cupcakes on8 and22, Halloween31, all UI labels, palette, watercolor texture and dimensions. Correct only the following small details:
1. On the fourth path row, the arrow between the pumpkin labeled24 at the left and the pumpkin labeled23 to its right currently points RIGHT. Flip that arrow to point LEFT, toward24: the row flows19,20,21,22,23,24 from right to left. All other arrows remain as they are.
2. Remove the tiny curved path spur and down-arrow immediately BEFORE day1 at the far left of the top row. The path must simply begin at day1 and go right to2, without an entry spur that suggests a shortcut to12.
3. Remove the two decorative wooden slogan signs at the left and right outer edges (the signs reading Small Steps Bright Days and Kindness Grows Here). Fill only their former areas with the surrounding autumn vegetation in matching style. Preserve all other scenery, squirrel, flowers, fence, ghost and decorations.
Do not add, remove, change or move any date number, birthday label or UI element. Output the same complete1536x1024page.
```

## Christmas — final localized refinement

Edit target: [version 1](concepts/calendar-christmas-v1.png). Final output: [version 2](concepts/calendar-christmas-v2.png).

```text
Use case: precise-object-edit. Make a strictly localized correction to the provided finished December calendar concept. Preserve the composition, every numbered ornament1 through31, date positions, ladybug and Santa hat at12, birthday cupcakes on8 and22, Christmas25, all UI labels, palette, watercolor texture and dimensions.
1. On the SECOND path row, the arrow between the ornament labeled12 at left and the ornament labeled11 to its right currently points RIGHT. Flip ONLY that arrow to point LEFT, toward12. This row flows7,8,9,10,11,12 from right to left. Every other path arrow stays the same.
2. Remove the decorative wooden slogan sign at upper left (Small Steps Bright Tomorrows). Reconstruct that small area with matching snow and snowy evergreen scenery. Leave the Back to group button above it untouched.
Do not add, remove, change or move any date number, birthday label, Christmas ribbon or UI element. The path must still continue through26,27,28,29,30,31. Output the same complete1536x1024page.
```

