# Living garden animation assets

Generation method: built-in `image_gen` tool. Both generated sheets are 1536 × 1024, three columns by two rows, with 512px cells. The scenery sheet is used through CSS background positioning and multiply blending. The generated ladybug poses remain an earlier study; the live page uses frames from the user's video instead. No source images were replaced.

## Ladybug poses

Source: [approved mascot](../public/assets/mascots/ladybug.png).
Output: [six-pose animation study](concepts/ladybug-animation-study.png), superseded in the live page by the user's video.
Order: resting, blink, first wave, second wave, wings up, wings out. The first four poses keep a consistent body registration; the flight poses are used during travel.

```text
Use case: stylized-concept / animation asset.
Edit the provided character reference into one professionally registered SIX-FRAME animation spritesheet. Preserve the EXACT approved ladybug identity, hand-painted watercolor texture, red shell with black spots, black head, cream face, rosy pink cheeks, antennae, six black legs, soft friendly proportions and three-quarter right-facing direction.
Output one 1536 x 1024 opaque PNG sheet, exactly THREE equal columns and TWO equal rows, six 512 x 512 invisible square cells, no margins or gutters between cells. Every cell has a uniform PURE WHITE #FFFFFF background, with no paper texture or color outside the insect. No grid lines, labels, numbers, text, shadows, props or scenery.
Registration is critical: the ladybug's core shell/body, head and resting feet occupy the SAME coordinates at the SAME scale in every cell, body center x=250, feet baseline y=420, insect body approx 370 pixels wide. Leave enough empty padding for antennae, the raised front leg and unfolded wings. Each entire pose stays inside its own cell. The reference shows the resting pose; resize uniformly to fit. Keep the core face/head/body appearance almost identical, changing only the specified animated parts.
Frame order left to right, top row then bottom row:
1 top-left: friendly resting ladybug, both round eyes open, all legs lowered, wings CLOSED under the red spotted shell.
2 top-middle: same resting pose and position but a warm blink, both eyes gently CLOSED as curved arcs; unchanged shell, head, smile, legs.
3 top-right: same pose with eyes open; the foremost little leg is raised up near its face for a friendly wave. The other legs and body stay fixed.
4 bottom-left: second wave pose, same foremost little leg moved outward higher in a wave. Everything else stays registered.
5 bottom-middle: takeoff pose, red spotted wing covers lift gently and TWO delicate translucent cream-blue flight wings open behind the body, wings pointing upward. Preserve face and black legs and the same core body location. Do not turn the insect away.
6 bottom-right: second flight-wing pose, translucent wings move outward/downward in a flutter, red spotted covers remain lifted. Same core body position and face. The movement from frame 5 to 6 should be a natural wing flap.
This is traditional charming children's storybook art, NOT pixel art, NOT 3D. Exact six poses, no duplicates missing, no different characters, no extra appendages beyond six legs/two antennae/two translucent wings with shell covers. The six cells must be aligned for direct CSS spritesheet playback without cropping correction.
```

## Scenery layers

Source: [approved carousel design](concepts/group-selection-v4-carousel.png).
Output: [garden layers](../public/assets/welcome/garden-layers-v1.png).
Order: leaf perch, daisies, poppies, cloud, second daisy cluster, meadow mound.

```text
Use case: illustration-story / layered website scenery assets.
Use the provided approved kindergarten meadow webpage as the exact style reference, and generate a matching decorative ASSET SHEET. Do not include the webpage UI or any animals.
Create an opaque 1536x1024 PNG with precisely THREE equal columns and TWO equal rows, each invisible cell 512x512. Each cell has a perfectly uniform PURE WHITE #FFFFFF background outside its one illustration, no texture on white, no visible grid or labels, no shadows outside the object. Every object completely fits inside its cell with at least 24px padding. NO TEXT.
Hand-painted children's storybook watercolor/gouache matching the reference: soft painted texture, fresh leaf greens, warm yellow flower centers, white daisies with enough gentle cream shading to remain legible, coral-red poppies, blue cornflowers, sunny soft colors and friendly round shapes. Rich crafted illustration, not vector, not 3D, not pixel art.
Six separate objects left to right top then bottom:
1. A broad curving green leaf landing perch on a short thick green stem, seen slightly from above in three-quarter view. The leaf is large and horizontal with a gently cupped top, conspicuous painted veins, tip pointing right. It occupies the lower two-thirds of the cell. A little grass at the stem base. No insect on leaf; it is a platform for a separately layered ladybug.
2. A tall graceful clump of THREE white daisies, different heights, on curving green stems with broad leaves and a few grass blades at base. Overall diagonal lean slightly right. Fully contained.
3. A lush foreground cluster of two coral red poppies, two small blue cornflowers, broad green leaves and grass. The red flowers are friendly round botanical blooms. Asymmetric lively silhouette.
4. One soft fluffy sky-blue-and-white watercolor cloud, wide and low, like the clouds in the reference. Center it in its cell.
5. A second graceful clump of two tall white daisies and one small yellow wildflower, leaning left, with green stems and leaves; variation to frame the opposite side of the page.
6. A low curved grassy meadow mound, horizontal oval silhouette, bright green grass with little white daisies, tiny buds and a couple of leaves, seen from the front and slightly above. No fence, no rocks, no animals.
Maintain clearly separated clean white cells for CSS background-position asset use. No extra objects, animals, insects, humans, buildings, signs, lettering, sun, UI, checkerboard or watermark.
```
