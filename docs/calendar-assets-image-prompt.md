# Calendar production watercolor asset

- Final asset: `public/assets/calendar/seasonal-markers.png`
- Generator: built-in imagegen (two calls: original atlas and spacing refinement).
- Actual output dimensions: **1254 × 1254 px**. Both prompts requested 1536 × 1536; the generator returned 1254 square. No programmatic image editing or resizing was performed.
- Background: white. The `.calendar-art` class uses the `calendar-paper-cutout` SVG filter to remove only near-white exterior paper. Painted petals and cream number centers remain opaque; do not multiply-blend day markers over the trail.
- Atlas arrangement: **4 columns × 4 rows**, in row-major reading order. Generated object positions vary within this approximate grid.
- Production rendering: `src/ui/pages/Calendar/CalendarArt.tsx` embeds the 1254 × 1254 image in an SVG. It selects each illustration with a **270 × 270 source-pixel viewBox** centered at the per-object coordinates below: `viewBox="${x - 135} ${y - 135} 270 270"`.
- The per-object crops align pale interiors with the runtime day numbers and exclude nearby artwork from the imperfect grid. CSS `overflow: hidden` clips the SVG viewport; the source PNG remains unchanged.
- Verified visually: all 16 correct subjects in the requested order, no dates or labels, and twelve quiet pale interiors. The selected crop bounds retain each full illustration, including leaves, stems, balloons, and the tree star.

## Indices

| Index | Purpose                                |
| ----- | -------------------------------------- |
| 0     | January: snowflake                     |
| 1     | February: heart blossom                |
| 2     | March: lavender crocus                 |
| 3     | April: peach tulip                     |
| 4     | May: blush peony                       |
| 5     | June: ivory daisy                      |
| 6     | July: sunflower                        |
| 7     | August: coral poppy                    |
| 8     | September: red apple                   |
| 9     | October: orange pumpkin                |
| 10    | November: beige acorn                  |
| 11    | December: Christmas wreath             |
| 12    | Birthday cupcake, candle, two balloons |
| 13    | Valentine's floral heart wreath        |
| 14    | Halloween friendly pumpkin and ghost   |
| 15    | Christmas tree                         |

## Production crop centers

These coordinates match the `centers` array in `CalendarArt.tsx`. Each coordinate is measured in source-image pixels from the PNG's top-left corner. Month markers and the Valentine's heart wreath use the quiet cream interior's area centroid as their crop center so runtime numbers can remain centered over the SVG. The birthday, Halloween and Christmas-tree decorations retain their visual centers.

The cream interiors were measured from the unchanged PNG by flood-filling each connected pale region from its previous center. Three RGB thresholds were compared to distinguish the cream interior from colored petals, outlines and exterior white paper. The stricter thresholds excluded the peach tulip's similarly colored petals. Rounded, stable area centroids were checked against the source illustration; this places text inside the acorn body and crocus interior rather than at the center of the whole object or its bounding box. The heart interiors' tapered lower tips likewise make their area centroids sit higher than their bounding-box midpoints. Font baseline and optical text alignment are handled separately in page CSS.

| Index | Illustration    | Center x | Center y |
| ----- | --------------- | -------- | -------- |
| 0     | January         | 183      | 191      |
| 1     | February        | 482      | 193      |
| 2     | March           | 772      | 191      |
| 3     | April           | 1072     | 194      |
| 4     | May             | 181      | 465      |
| 5     | June            | 478      | 465      |
| 6     | July            | 774      | 468      |
| 7     | August          | 1072     | 468      |
| 8     | September       | 174      | 775      |
| 9     | October         | 473      | 779      |
| 10    | November        | 767      | 783      |
| 11    | December        | 1070     | 769      |
| 12    | Birthday        | 177      | 1040     |
| 13    | Valentine's Day | 479      | 1031     |
| 14    | Halloween       | 779      | 1055     |
| 15    | Christmas tree  | 1070     | 1039     |

Update these coordinates alongside `CalendarArt.tsx` if a future generated atlas changes object positions. The exact generation prompts below document the originally requested grid, while these coordinates describe the final asset's actual production use.

## Exact original prompt

```text
Use case: illustration-story
Asset type: one production sprite atlas for interactive children's calendar day markers.
Primary request: Create ONE square 1536 x 1536 PNG asset atlas containing exactly 16 isolated watercolor objects in a precisely registered invisible 4-column by 4-row grid. Each grid cell is exactly 384 x 384. Background must be flat pure white. No page UI, no scenery, no borders, no visible grid lines, no captions, no text, no numerals, no watermarks.
Input images: all four images are STYLE REFERENCES ONLY, not layouts to reproduce. Image 1 generic floral calendar, Image 2 Valentine's calendar, Image 3 Halloween calendar, Image 4 Christmas calendar. Match their lush, tender children's storybook watercolor painting with subtly textured petals, softly shaded dimensional objects, warm gentle highlights, small green leaves, soft hand-painted edges and jewel-toned accents.
Composition: one full object per cell, centered exactly at the cell midpoint. Cell centers are x=192,576,960,1344 and y=192,576,960,1344. Objects including leaves/stems must fit inside a 280 x 280 square centered in each cell. White margins must remain on all sides and objects must never touch or enter another cell. All objects consistently comparable in scale. Front-facing readable shapes.
Critical for first twelve cells: These are functional calendar day markers. Every one MUST have a LARGE BLANK QUIET LIGHT CREAM INTERIOR in the center, at least 105 px across, reserved for dark runtime day numbers. Paint no digits, letters, faces, patterns, speckles or details in those center areas. Flower petals and themed silhouette surround this center. For apple, pumpkin and acorn use a softly lit pale cream oval on the front.
Exact reading order, left to right then top to bottom:
ROW 1 cell 0: delicate pale blue snowflake with softly rounded ivory circular center.
ROW 1 cell 1: pink heart-shaped blossom with large light blush/ivory heart interior and small green leaves.
ROW 1 cell 2: open lavender crocus flower with broad pale ivory center.
ROW 1 cell 3: open pastel peach tulip blossom with large pale ivory center.
ROW 2 cell 4: layered blush pink peony flower with broad pale ivory center.
ROW 2 cell 5: ivory white daisy with pale golden ivory circular center.
ROW 2 cell 6: golden sunflower with broad LIGHT CREAM center, not dark brown.
ROW 2 cell 7: coral red poppy flower with broad light cream center, not black.
ROW 3 cell 8: red apple with short stem and green leaf, large light cream front center.
ROW 3 cell 9: softly orange pumpkin with green stem and large light cream front center, no carved face.
ROW 3 cell 10: warm beige acorn with brown cap and large quiet pale cream body.
ROW 3 cell 11: deep green Christmas wreath with red berries and small red bow on top, broad blank light cream circular center.
ROW 4 cell 12: one pink frosted birthday cupcake with a lit candle and TWO small pastel balloons attached beside it. Decoration only; no need for reserved center.
ROW 4 cell 13: pink and coral heart-shaped floral wreath, broad empty ivory heart interior.
ROW 4 cell 14: smiling friendly pumpkin beside one tiny smiling friendly white ghost, child-friendly Halloween decoration.
ROW 4 cell 15: decorated evergreen Christmas tree with small golden star and red/gold baubles, child-friendly.
Avoid: all text and digits, grid lines, page backgrounds, lawns or paths, extra objects between cells, cast shadows crossing cells, vector/flat clip art styling. Produce only the precise watercolor atlas.
```

## Exact spacing refinement prompt

```text
Use case: precise-object-edit
Edit target: the supplied watercolor sixteen-object atlas.
Keep every object design, color, texture, blank cream center, reading order and white background exactly as supplied. Change ONLY size and precise alignment of objects.
Output must be a square 1536 x 1536 PNG. Use an invisible 4 by 4 equal grid with cells 384 x 384. Put the center of every object's full bounding box at its cell midpoint: x=192,576,960,1344; y=192,576,960,1344. Reduce every object including leaves to fit inside a 260 x 260 square, with a minimum 62px PURE WHITE empty margin to each cell edge. Leave clean broad white spacing between all objects. The current artwork is too tightly packed; make all sixteen smaller but preserve the exact art. No parts may leave their own cell or approach a neighbor.
Object order unchanged: row1 snowflake, heartblossom, crocus, tulip; row2 peony, daisy, sunflower, poppy; row3 apple, pumpkin, acorn, Christmaswreath; row4 birthdaycakeballoons, heartwreath, friendlypumpkinghost, Christmastree.
Do not draw a grid. No numbers, no text. Exact geometric equal-cell placement, large white margins, same watercolor artwork.
```

## References and generation files

Style references:

- `docs/concepts/calendar-generic-v1.png`
- `docs/concepts/calendar-valentines-v1.png`
- `docs/concepts/calendar-halloween-v2.png`
- `docs/concepts/calendar-christmas-v2.png`

Original generated atlas: `/Users/robadrian/.codex/generated_images/01a08cc8-e674-7911-849b-d9fd90e14d97/exec-f12ff12a-b1f1-46ae-bd41-b6ff8ed53ebb.png`

Selected refined atlas: `/Users/robadrian/.codex/generated_images/01a08cc8-e674-7911-849b-d9fd90e14d97/exec-90da1092-0796-4ba8-91e0-15e639b882e3.png`
