# Calendar title decorations

- Final asset: `public/assets/calendar/seasonal-title-decorations.png`
- Production component: `src/ui/pages/Calendar/TitleArt.tsx`
- Generator: built-in imagegen, one original generation and one background/spacing correction.
- Actual output dimensions: **1448 × 1086 px**, a 4:3 atlas containing four columns and three rows.
- Background: opaque white. True transparency was requested in the first call, but the output had no alpha and contained a painted checkerboard. The correction removed that checkerboard and used the permitted white fallback.
- All illustrations have natural, fully painted centers. There are no pale number panels, blank date circles, or empty wreath frames.
- The PNG has not been programmatically edited. The existing day-marker atlas remains unchanged.
- `TitleArt` accepts a zero-based `monthIndex` and optional `className`, and adds `calendar-title-art` to the SVG.
- Rendering uses a **320 × 320 source-pixel viewBox** centered on each complete painting. This retains leaves, stems, snowflake tips and holly sprays while excluding adjacent illustrations.
- The component uses `mix-blend-mode: multiply` to blend the white background against the title's paper surface, and `overflow: hidden` to clip each crop. Page CSS owns the illustration's display size and placement.

## Index mapping and source crop centers

| Index | Month | Subject | Center x | Center y |
| --- | --- | --- | --- | --- |
| 0 | January | Fully branched crystalline snowflake | 187 | 202 |
| 1 | February | Solid pink heart with blossoms | 545 | 212 |
| 2 | March | Lavender crocus with orange stamens | 915 | 209 |
| 3 | April | Natural peach tulip | 1265 | 204 |
| 4 | May | Natural peony with layered petals and stamens | 188 | 535 |
| 5 | June | White daisy with golden pollen center | 544 | 534 |
| 6 | July | Sunflower with dark brown seeds | 910 | 538 |
| 7 | August | Red poppy with dark natural center | 1273 | 540 |
| 8 | September | Whole red apple | 176 | 874 |
| 9 | October | Whole orange pumpkin | 546 | 872 |
| 10 | November | Natural brown acorn | 909 | 878 |
| 11 | December | Evergreen, holly and red bow bouquet | 1262 | 879 |

## Exact original prompt

```text
Use case: illustration-story
Asset type: one production atlas of twelve watercolor decorative objects for calendar page titles.
Primary request: Create ONE 1536 x 1152 PNG, landscape 4:3, with exactly twelve isolated fully painted natural objects in four equal columns and three equal rows. Each conceptual cell is 384 x 384. These are title decorations, NOT calendar buttons. No pale blank circles, no number spaces, no cutouts, no empty center frames.
Input image: the supplied sixteen-object atlas is a STYLE REFERENCE ONLY. Match its lush children's storybook watercolor, visible delicate brush texture, softly shaded dimensional petals, warm highlights, gentle outlines, and lively colors. Change the anatomy to natural fully painted objects. Do not copy its blank date interiors or its fourth row.
Background: genuinely transparent PNG alpha behind all objects; no checkerboard drawn into the pixels. All painted objects themselves must remain fully opaque, with natural rich colors. If transparency cannot be produced, use flat pure white.
Layout: precise invisible 4 columns x 3 rows. Object centers x=192,576,960,1344; y=192,576,960. Each complete object including leaves and stems fits within a 270 x 270 square centered in its cell; plenty of transparent margin. No overlaps across cells. No visible grid. Twelve objects only, exact reading order:
ROW 1 LEFT TO RIGHT:
January: a delicate symmetrical icy blue crystalline snowflake, SIX continuous branches meeting in a detailed small blue crystalline hub; fully natural snowflake, NO round ivory center.
February: a solid full pink-red heart, rosy pink throughout with subtle watercolor shading and tiny blossoms/green leaves at edges; NO heart-shaped hole, NO cream center.
March: natural lavender crocus flower with distinct petals and small visible orange stamens in its natural narrow center, short leaves; NO circular date disc.
April: natural peach tulip flower with layered gently cupped petals and short green leaves, fully painted peach petal center; NO blank circle.
ROW 2 LEFT TO RIGHT:
May: lush pink peony blossom, many irregular interlocking petals filling its entire center, a few small leaves; NO blank central space.
June: natural ivory daisy, white petals around small textured golden yellow pollen center, green leaves; center is natural saturated yellow, NOT pale cream blank disc.
July: golden sunflower with a rich dark BROWN densely textured seed center, yellow petals and two green leaves; NO pale blank center.
August: red coral poppy with natural small BLACK and deep purple stamens and seed center, green leaves; NO pale blank center.
ROW 3 LEFT TO RIGHT:
September: whole fully RED apple with natural red watercolor shading across its entire body, brown stem and green leaf; NO cutout, NO white or cream front panel.
October: whole orange pumpkin with natural orange ribs across its entire front, green stem and little leaf; NO carved face, NO cream front panel.
November: natural acorn with textured brown cap and warm golden brown fully painted body, small oak leaves; NO white or cream body center.
December: festive evergreen bouquet tied with a red bow, holly leaves, red berries, pine sprigs, and small pinecone; dense natural arrangement with greenery in the center, NOT a wreath or ring, NO hole or cream center.
Constraints: No words, letters, numbers, ribbons for labels, buttons, badges, central discs, central blank light cream shapes, white front patches, circular medallions, page UI, landscapes, ground shadows, extra objects between cells, or watermarks. Preserve naturally textured watercolor anatomy and fully opaque colored objects. These are natural decorative illustrations with NO number spaces.
```

## Exact correction prompt

```text
Use case: precise-object-edit
Edit target: supplied twelve-object natural watercolor title decoration atlas.
Change ONLY the background and spacing, preserving all twelve object designs, order, naturally painted centers, anatomy, color, and beautiful watercolor details exactly.
CRITICAL: Replace every checkerboard gray square in the background with flat solid pure WHITE #FFFFFF. Remove the entire checkerboard pattern. This must be an opaque white-background image, not transparent; no checkerboard anywhere, no grey grid, no paper texture. Keep the colored objects fully opaque.
Retain landscape 4:3 image shape and exact arrangement of 4 columns by 3 rows. Shrink each complete object to 70% of its current size, centered in its equal-sized cell. Leave broad pure WHITE empty margin around each object. At least50px clean white spacing between neighboring illustrations. Every full object including leaves and stems fits within its cell.
Keep the object order: row1 natural crystalline snowflake, solid pink heart with blossoms, lavender crocus with orange stamens, peach tulip; row2 pink peony, yellow-centered white daisy, dark brown seeded sunflower, dark-centered red poppy; row3 whole red apple, whole orange pumpkin, natural brown acorn, festive evergreen holly red-bow bouquet.
Keep all centers naturally fully painted. No pale blank circular patches, no day-number spaces, no cutouts or medallions. No text or labels. Output just this corrected twelve-object watercolor asset atlas with pure white background.
```

## Reference and provenance

Style reference, inspected before generation: `public/assets/calendar/seasonal-markers.png`.

Original output with unsuccessful transparency, not used in the application:
`/Users/robadrian/.codex/generated_images/01a08cc8-e674-7911-849b-d9fd90e14d97/exec-8c734001-c3fa-4741-93bd-d17c12073ac0.png`

Selected corrected output, copied into the workspace:
`/Users/robadrian/.codex/generated_images/01a08cc8-e674-7911-849b-d9fd90e14d97/exec-b994d1dc-73fc-4cac-b647-a0acf0869cf0.png`

Visual inspection confirmed all twelve subjects in the correct order, natural painted centers, pure white spacing and intact silhouettes. `sips` confirmed the final dimensions and absence of an alpha channel.
