# Responsive seasonal backgrounds

All six illustrated pages use `src/ui/assets/styles/meadow-background.css`: Group Selection, Welcome, Students, Today, Calendar, and Component Preview. Calendar sets `data-season` from the selected month; the other pages use summer.

The decorative image sits in a fixed, non-interactive pseudo-element behind each page. Its dimensions follow the viewport, so scrolling content does not enlarge the scene. This avoids relying on `background-attachment: fixed` on tablets. Images use proportional `cover` sizing and top-center positioning to retain the sun. Nearby aspect ratios can crop edge scenery slightly.

| Viewport width / height | Composition                    | Filename suffix         |
| ----------------------- | ------------------------------ | ----------------------- |
| Up to 1:1               | Portrait tablet (3:4)          | `-tablet.png`           |
| Above 1:1, below 7:5    | Landscape tablet (4:3)         | `-tablet-landscape.png` |
| 7:5 to below 5:3        | Original landscape (3:2)       | `.png`                  |
| 5:3 to below 9:4        | Desktop (approximately 16:9)   | `-desktop.png`          |
| 9:4 and wider           | Ultrawide (approximately 12:5) | `-ultrawide.png`        |

Each filename begins with `group-selection-{spring|summer|autumn|winter}` and lives in [public/assets/backgrounds](../public/assets/backgrounds). Media queries adapt automatically when a tablet rotates. Only the selected image is used as the background.

Fourteen new images were created using built-in imagegen as separate edits of the approved seasonal sources. Original assets and the existing summer desktop/ultrawide images were preserved. Tool-selected dimensions are recorded below; generated images were not stretched or cropped after generation. Earlier summer desktop and ultrawide prompts remain in [responsive-background-image-prompts.md](responsive-background-image-prompts.md).

## Responsive summer tablet backgrounds

Method: built-in imagegen, separate edits of `public/assets/backgrounds/group-selection-summer.png`.

Saved assets:

- `public/assets/backgrounds/group-selection-summer-tablet.png`: 1086 × 1448 (3:4).
- `public/assets/backgrounds/group-selection-summer-tablet-landscape.png`: 1448 × 1086 (4:3).

### Tablet portrait

```text
Use case: precise-object-edit / background-extension. Edit target: supplied summer kindergarten meadow background. Recompose this SAME scene into ONE PORTRAIT TABLET background, requested dimensions 1152x1536 EXACT 3:4 portrait. Keep identical storybook hand-painted watercolor/gouache artwork and warm cream paper texture. Preserve smiling ROUND sun upper right, leafy branch upper left, soft pale blue clouds upper outer edges, green trees at far side edges lower down, fence bottom left, rocks bottom right, summer daisies poppies and blue flowers along LOW U-shaped green meadow bottom border. Move corner artwork outward to canvas edges, reduce decoration scale proportionally to fit tablet, use narrow edge foliage and LOW bottom ground leaving at least 80% of center height spacious and quiet for UI. The sun and all flowers retain round undistorted proportions. Extend empty cream center vertically. Do not zoom or crop the source. Do not stretch objects. The sun and rays fully visible within canvas. Same sunny summer theme, no new elements. No text, labels, UI, controls, people, characters, frame, watermark, panels or montage. One full-bleed opaque portrait background only.
```

### Tablet landscape

```text
Use case: precise-object-edit / background-extension. Edit target: supplied summer kindergarten meadow background. Recompose this SAME scene into ONE LANDSCAPE TABLET background, requested1536x1152 EXACT4:3 landscape. Keep identical storybook hand-painted watercolor/gouache artwork and warm cream paper texture. Preserve smiling ROUND sun upper right, leafy branch upper left, soft pale blue clouds upper outer edges, green trees at far side edges lower down, fence bottom left, rocks bottom right, summer daisies poppies and blue flowers along LOW U-shaped green meadow bottom border. Reposition artwork to fit the new aspect ratio naturally and preserve proportions. Keep the complete sun and every ray FULLY visible with a safety margin of at least3%of total canvas width between the rays and top/right edges. Keep foliage narrow at outeredges, low meadow border, the large center quiet for UI. Sun and all flowers must retain round undistorted proportions. Do not zoom or crop the source. Do not stretch objects. Same sunny summer theme, no new elements. No text, labels, UI, controls, people, characters, frame, watermark, panels or montage. One full-bleed opaque4:3landscape background only.
```

## Spring responsive background prompts

### Tablet landscape additional prompt

Use case: precise-object-edit.
Asset type: full viewport landscape tablet background for a children's group selection web app.
Input image: Image 1 is the exact existing spring background edit target, to preserve.
Primary request: Recompose this same existing spring illustration into a 4:3 LANDSCAPE TABLET canvas, requested output 1536 x 1152 pixels. This is one complete landscape image, not a montage. Preserve the exact watercolor storybook technique, cream paper texture, gentle spring palette and recognizable objects. Keep the round smiling yellow sun at the upper-right with a circular face, pink blossoming branch entering upper-left, small normal-proportion spring trees at the far left and far right edges, brown fence near bottom-left and gray stones near bottom-right. Preserve the pink tulips, yellow daffodils, tiny daisies, blue clouds and scattered petals as modest edge decoration.
Composition/framing: Recompose naturally for a 4:3 tablet screen with a very large continuous quiet warm cream central region for UI. IMPORTANT: keep the COMPLETE round sun and ALL rays fully inside the image, with a safety inset of at least 3% of the canvas width between the outermost ray and the right edge and at least 3% of the canvas width between the outermost top ray and the top edge. Make the sun small enough to fit the upper-right corner with this breathing room. Keep the blossoming branch in the upper-left corner and foliage narrow along the outermost edges. Preserve normal undistorted circles and tree proportions. Make the meadow a LOW shallow U-shaped spring border along the bottom: its middle occupies only the lowest 5%, and the corners no more than the lowest 18%. Leave a large uninterrupted cream UI center, including the middle 80% of the width.
Constraints: Change only composition and canvas aspect ratio. No cropping off any part of the sun or rays, no stretching or squeezing any objects, no enlarged central decorations, no new objects or characters, no text, no logo, no watermark, no border frame, no tiled or repeated panels. The entire image must have the requested 4:3 landscape aspect ratio.

Mode: built-in `image_gen` edit tool.
Reference: `/Users/robadrian/Desktop/work/Personal/buburuzele/public/assets/backgrounds/group-selection-spring.png`

+## tablet

Use case: precise-object-edit.
Asset type: full viewport tablet background for a children's group selection web app.
Input image: Image 1 is the exact existing spring background edit target, to preserve.
Primary request: Recompose this same existing spring illustration into a 3:4 PORTRAIT canvas, requested output 1152 x 1536 pixels. This is a separate, complete portrait image, not a montage. Preserve the same watercolor storybook technique, cream paper texture, gentle spring palette and recognizable objects. Keep the round smiling yellow sun at the upper-right with a circular face, pink blossoming branch entering upper-left, very narrow small normal-proportion spring trees at the left and right edges, the brown fence near bottom-left and gray stones near bottom-right. Preserve the pink tulips, yellow daffodils, tiny daisies, blue clouds and scattered petals as the same modest edge decoration.
Composition/framing: Extend/recompose the cream empty background vertically for portrait tablets. Scale the decorations DOWN proportionally in the portrait composition: upper-left branch occupies only the corner, sun occupies only the upper-right corner, side foliage is narrow against the outermost left/right edges. Make the bottom meadow a LOW shallow U-shaped border with flowers: its middle rises no higher than the lowest 5% of canvas and its corners no higher than the lowest 14%. A VERY LARGE continuous quiet cream center must remain clear for the UI through 80% of canvas height. No foliage, flowers or sun near the central content area.
Constraints: Change only composition and canvas aspect ratio. No cropping off the sun face, no stretching or squeezing any objects, no enlarged decorations, no new objects or characters, no text, no logo, no watermark, no border frame. Do not reproduce a landscape image inside a portrait canvas: create a naturally portrait composition filling the requested canvas.

### desktop

Use case: precise-object-edit.
Asset type: full viewport desktop background for a children's group selection web app.
Input image: Image 1 is the exact existing spring background edit target, to preserve.
Primary request: Recompose this same existing spring illustration into a 16:9 LANDSCAPE canvas, requested output 2048 x 1152 pixels. This is one complete landscape image, not a montage. Preserve the same watercolor storybook technique, cream paper texture, gentle spring palette and recognizable objects. Keep the round smiling yellow sun at the upper-right with a circular face, pink blossoming branch entering upper-left, normal-proportion spring trees along the far left and far right edges, the brown fence near bottom-left and gray stones near bottom-right. Preserve pink tulips, yellow daffodils, tiny daisies, blue clouds and scattered petals as modest edge decoration.
Composition/framing: Recompose naturally for the wider canvas with a larger continuous warm cream quiet central region for UI. Anchor the branch to the upper-left and sun to the upper-right, with breathing room from the edges. Keep trees small and outermost, and preserve normal circular flowers, sun and natural tree proportions. Make the meadow a LOW U-shaped spring border along the bottom: the center occupies only the lowest 5% and the corners no more than the lowest 20%. Reserve the central 80% of the canvas width as clear cream negative space.
Constraints: Change only composition and canvas aspect ratio. No cropping off key decorations, no stretching or squeezing, no cloned or repeated panels, no new objects or characters, no text, no logo, no watermark, no border frame. The whole output must have the requested landscape aspect ratio.

### ultrawide

Use case: precise-object-edit.
Asset type: full viewport ultrawide desktop background for a children's group selection web app.
Input image: Image 1 is the exact existing spring background edit target, to preserve.
Primary request: Recompose this same existing spring illustration into an ULTRAWIDE 12:5 landscape canvas, requested output 2400 x 1000 pixels. This must be a separate complete ultrawide image, not a montage. Preserve the same watercolor storybook technique, cream paper texture, gentle spring palette and recognizable objects. Keep the round smiling yellow sun at the upper-right with a circular face, pink blossoming branch entering upper-left, small normal-proportion spring trees at far left and far right, brown fence near bottom-left and gray stones near bottom-right. Preserve pink tulips, yellow daffodils, tiny daisies, blue clouds and scattered petals only as modest edge decoration.
Composition/framing: Extend/recompose the cream negative space much farther horizontally to create a naturally ultrawide scene. Sun and branch remain in their top corners. The side trees and foreground flower clusters are compact at the outermost ends, with normal undistorted dimensions, leaving the vast central 80% of the width empty cream for UI. Make the bottom meadow a LOW SHALLOW U-shaped border, the center in only the lowest 5% and corners no more than lowest 20%. Most of the horizontal center is quiet cream paper with a light original texture.
Constraints: Change only composition and canvas aspect ratio. No stretching or squeezing any objects, no elliptical sun or squashed trees, no cropping off sun face, no tiled/duplicated background panels, no montage, no new objects or characters, no text, no logo, no watermark, no border frame. The whole image must have the requested ultrawide aspect ratio.

### Final artifacts and validation

The built-in image tool chose final pixel dimensions close to the requested aspect ratios. No resizing, cropping, or stretching was applied after generation. Visually inspected all outputs: source art style, round sun, normal tree proportions, blossoms/fence/stones, and clear cream central region preserved.

- /Users/robadrian/Desktop/work/Personal/buburuzele/public/assets/backgrounds/group-selection-spring-tablet.png: 1086 x 1448 pixels, 1547730 bytes
- /Users/robadrian/Desktop/work/Personal/buburuzele/public/assets/backgrounds/group-selection-spring-desktop.png: 1672 x 941 pixels, 1648953 bytes
- /Users/robadrian/Desktop/work/Personal/buburuzele/public/assets/backgrounds/group-selection-spring-ultrawide.png: 1942 x 809 pixels, 1668717 bytes

### Tablet landscape final artifact and validation

/Users/robadrian/Desktop/work/Personal/buburuzele/public/assets/backgrounds/group-selection-spring-tablet-landscape.png: 1448 x 1086 pixels, 1737787 bytes

Visually inspected the built-in imagegen output: exact 4:3 landscape ratio, complete round sun and all rays inside the image with a small edge inset, recognizable branch, normal tree proportions, quiet cream center, low meadow center. No resizing, cropping, or stretching applied after generation.

## Responsive autumn backgrounds

### Landscape tablet follow-up

Saved output: `public/assets/backgrounds/group-selection-autumn-tablet-landscape.png`, 1448 × 1086 (exact 4:3), created with built-in imagegen. Visually inspected: complete round smiling sun with all rays inside the canvas; autumn corner scenery and quiet cream center retained.

```text
Use case: precise-object-edit / responsive-background-recomposition.
Asset type: opaque full-bleed autumn storybook background for a kindergarten web app.
Input image: approved original autumn meadow; this is the edit target.
Create ONE new LANDSCAPE TABLET version at exact 4:3 aspect ratio, requested 1536 pixels wide by 1152 pixels high. Recompose the approved scene for a 4:3 tablet display; do not crop the 3:2 reference or stretch it.
Preserve its watercolor/gouache style, subtle cream paper texture, warm orange/amber/russet autumn colors and recognizable objects: leafy branch entering upper left, friendly ROUND smiling sun upper right, pale blue clouds near top edges, modest normal-proportion trees at outer sides, wooden fence bottom left, rocks bottom right, small mushrooms and leaves within a low U-shaped meadow border. Keep a very large quiet warm cream center for app content.
The sun AND ALL ITS RAYS must be completely visible. Make this a modest corner accent, keeping the outermost rays at least 3 percent of the canvas width away from the right edge and at least 3 percent of the canvas height below the top edge. Preserve normal circular sun proportions. Keep fence and rocks recognizable within their bottom corners. Outer foliage should be narrow and all bottom art low, leaving central 80 percent largely clear warm cream.
Move artwork to the new appropriate outer edges and extend quiet center naturally to fit landscape 4:3. Preserve low ground proportions, normal trees and recognizable source style. Do not add new objects, text, letters, UI, cards, panels, montage, framing, padding bars, seams, duplicated/mirrored scenery, people, mascots, buildings, transparency, watermarks, pumpkins or holiday decorations. One full-bleed opaque PNG at landscape 4:3 only.
```

Method: built-in imagegen, one independent edit per target aspect ratio.
Edit target: `public/assets/backgrounds/group-selection-autumn.png` (1536 × 1024).

Saved outputs (tool-selected actual dimensions, source preserved):

- `public/assets/backgrounds/group-selection-autumn-tablet.png`: 1086 × 1448, exact 3:4.
- `public/assets/backgrounds/group-selection-autumn-desktop.png`: 1672 × 940, approximately 16:9.
- `public/assets/backgrounds/group-selection-autumn-ultrawide.png`: 1942 × 809, approximately 12:5.

Visual inspection: all three preserve the autumn scene, round smiling sun, complete corner composition and warm cream center. The portrait output has generous vertical whitespace and low ground; both landscape outputs extend the quiet center. No source assets were replaced.

### tablet

```text
Use case: precise-object-edit / responsive-background-recomposition.
Asset type: opaque full-bleed illustrated background for a child-friendly kindergarten web app.
Input image: the approved autumn meadow is the edit target. Create one separate new canvas showing THIS SAME SCENE and autumn season.
Preserve the watercolor/gouache storybook style, subtle cream paper texture, orange/amber/russet palette, round friendly smiling sun at upper right, leafy branch entering upper left, pale blue clouds near the top outer edges, modest normal-proportion autumn trees at outer sides, wooden fence bottom left, rocks bottom right, small mushrooms and scattered leaves only near the bottom and far sides. Keep the same low U-shaped meadow border and a very large quiet warm cream central area for UI.
Recompose the scene to fit the requested NEW ASPECT RATIO: reposition corners to the new outer edges and naturally extend the empty center and the low ground border. Preserve the sun, fence, rocks, trees and foliage at normal proportions without stretching or zooming. Keep the sun completely visible, including rays. Do not crop off important edge decorations. Keep all art confined to outer sides and low ground, with no trees or horizon crossing the central content area.
No text, letters, UI, panels, montage, frames, padding bars, seams, repeating or mirrored plants, new objects, buildings, people, mascots, transparent areas, watermarks, pumpkins or holiday decorations. One full-bleed opaque PNG only.
OUTPUT: Portrait TABLET background, exact 3:4 aspect ratio, requested 1152 pixels wide by 1536 pixels high. Change the source landscape composition to PORTRAIT. The top-left branch and complete smiling upper-right sun should be small corner accents. Trees and side foliage must be narrow and modest, kept to far left/right edges. Put the fence/rocks at the bottom corners and the low U-shaped autumn meadow only within the bottom 15 percent; do not raise the ground halfway up this tall canvas. The middle 80 percent of the image should be almost entirely empty warm cream for content. Increase vertical breathing room while keeping all illustration proportions normal.
```

### desktop

```text
Use case: precise-object-edit / responsive-background-recomposition.
Asset type: opaque full-bleed illustrated background for a child-friendly kindergarten web app.
Input image: the approved autumn meadow is the edit target. Create one separate new canvas showing THIS SAME SCENE and autumn season.
Preserve the watercolor/gouache storybook style, subtle cream paper texture, orange/amber/russet palette, round friendly smiling sun at upper right, leafy branch entering upper left, pale blue clouds near the top outer edges, modest normal-proportion autumn trees at outer sides, wooden fence bottom left, rocks bottom right, small mushrooms and scattered leaves only near the bottom and far sides. Keep the same low U-shaped meadow border and a very large quiet warm cream central area for UI.
Recompose the scene to fit the requested NEW ASPECT RATIO: reposition corners to the new outer edges and naturally extend the empty center and the low ground border. Preserve the sun, fence, rocks, trees and foliage at normal proportions without stretching or zooming. Keep the sun completely visible, including rays. Do not crop off important edge decorations. Keep all art confined to outer sides and low ground, with no trees or horizon crossing the central content area.
No text, letters, UI, panels, montage, frames, padding bars, seams, repeating or mirrored plants, new objects, buildings, people, mascots, transparent areas, watermarks, pumpkins or holiday decorations. One full-bleed opaque PNG only.
OUTPUT: Landscape DESKTOP background, exact 16:9 aspect ratio, requested 2048 pixels wide by 1152 pixels high. Extend the quiet center horizontally, move the sun and branch toward their respective top corners and trees to side edges. Keep all artwork and low ground border visible at moderate proportional sizes with a wide open UI center.
```

### ultrawide

```text
Use case: precise-object-edit / responsive-background-recomposition.
Asset type: opaque full-bleed illustrated background for a child-friendly kindergarten web app.
Input image: the approved autumn meadow is the edit target. Create one separate new canvas showing THIS SAME SCENE and autumn season.
Preserve the watercolor/gouache storybook style, subtle cream paper texture, orange/amber/russet palette, round friendly smiling sun at upper right, leafy branch entering upper left, pale blue clouds near the top outer edges, modest normal-proportion autumn trees at outer sides, wooden fence bottom left, rocks bottom right, small mushrooms and scattered leaves only near the bottom and far sides. Keep the same low U-shaped meadow border and a very large quiet warm cream central area for UI.
Recompose the scene to fit the requested NEW ASPECT RATIO: reposition corners to the new outer edges and naturally extend the empty center and the low ground border. Preserve the sun, fence, rocks, trees and foliage at normal proportions without stretching or zooming. Keep the sun completely visible, including rays. Do not crop off important edge decorations. Keep all art confined to outer sides and low ground, with no trees or horizon crossing the central content area.
No text, letters, UI, panels, montage, frames, padding bars, seams, repeating or mirrored plants, new objects, buildings, people, mascots, transparent areas, watermarks, pumpkins or holiday decorations. One full-bleed opaque PNG only.
OUTPUT: Very wide ULTRAWIDE background, exact 12:5 aspect ratio (2.4:1), requested 2400 pixels wide by 1000 pixels high. Canvas MUST become much wider than the 3:2 source. Add a broad horizontal expanse of empty warm cream center. Keep complete branch and smiling sun at opposite top outer corners, normal-proportion trees on far side edges, fence and rocks at opposite bottom outer corners. Naturally extend the low U-shaped ground through the new width without copying/mirroring sections. Preserve normal round shapes; do not stretch the old landscape. No crop, no panels or padding.
```

## Winter responsive background prompts

Mode: built-in imagegen editing, one separate call per variant.

Source: public/assets/backgrounds/group-selection-winter.png

### group-selection-winter-tablet.png (1152x1536 requested)

Use case: precise-object-edit.
Asset type: responsive illustrated website background for children's kindergarten group selection.
Input images: Image 1 is the edit target, the original winter background.
Primary request: Recompose the provided winter illustration for the requested screen ratio, preserving its recognizable visual identity, objects, palette, paper texture and soft watercolor painting style.
Invariants: Preserve the round smiling yellow sun at the upper right (a circle, never an oval), snow-covered brown branch entering from upper left, soft blue clouds near outer edges, sparse blue snowflakes at sides, normal-proportion snow-covered bare trees along the outer left and right edges, snow-dusted wood fence at bottom left, snowy rocks at bottom right, and a LOW U-shaped snowy ground border. Keep the middle a quiet warm cream paper background for UI, no text or interface drawn into the artwork. Do not add objects or characters. Reposition and scale the existing elements naturally to fit; never stretch, distort, crop-to-fit, tile, mirror or create a montage. Preserve the same balanced edge-framing scene and soft winter blue, warm cream, ochre and brown palette.
Output: ONE image only, portrait 3:4 canvas, requested pixel size 1152 by 1536.
Composition: This is a portrait TABLET adaptation. Make decorations proportionally smaller than the original so approximately the central 80% of the canvas remains quiet and clear for UI. Restrict tree silhouettes, branches, snowflakes and foliage to NARROW side margins; keep the top-left branch and upper-right sun compact. Keep the snow ground LOW in the bottom 8–12% at center with gently rising edge corners no higher than the bottom quarter. Fence and rocks stay compact in the bottom corners. A tall uninterrupted cream central opening is the priority. Render directly in portrait, with natural circular sun and natural tree proportions.

### group-selection-winter-desktop.png (2048x1152 requested)

Use case: precise-object-edit.
Asset type: responsive illustrated website background for children's kindergarten group selection.
Input images: Image 1 is the edit target, the original winter background.
Primary request: Recompose the provided winter illustration for the requested screen ratio, preserving its recognizable visual identity, objects, palette, paper texture and soft watercolor painting style.
Invariants: Preserve the round smiling yellow sun at the upper right (a circle, never an oval), snow-covered brown branch entering from upper left, soft blue clouds near outer edges, sparse blue snowflakes at sides, normal-proportion snow-covered bare trees along the outer left and right edges, snow-dusted wood fence at bottom left, snowy rocks at bottom right, and a LOW U-shaped snowy ground border. Keep the middle a quiet warm cream paper background for UI, no text or interface drawn into the artwork. Do not add objects or characters. Reposition and scale the existing elements naturally to fit; never stretch, distort, crop-to-fit, tile, mirror or create a montage. Preserve the same balanced edge-framing scene and soft winter blue, warm cream, ochre and brown palette.
Output: ONE image only, landscape 16:9 canvas, requested pixel size 2048 by 1152.
Composition: This is a wide DESKTOP adaptation. Extend the quiet warm cream center horizontally while moving existing edge elements to the newly positioned canvas edges. Give the UI a generous unobstructed center across roughly 80% of canvas width. Keep the sun and trees at natural proportions and compact corner scale. Snow sits in a low U-shaped border: bottom 7% at center, gently rising to bottom-quarter corners. Preserve fence bottom left and rock bottom right. Generate the wider composition directly with no crop, stretch, repeated panels or new objects.

### group-selection-winter-ultrawide.png (2400x1000 requested)

Use case: precise-object-edit.
Asset type: responsive illustrated website background for children's kindergarten group selection.
Input images: Image 1 is the edit target, the original winter background.
Primary request: Recompose the provided winter illustration for the requested screen ratio, preserving its recognizable visual identity, objects, palette, paper texture and soft watercolor painting style.
Invariants: Preserve the round smiling yellow sun at the upper right (a circle, never an oval), snow-covered brown branch entering from upper left, soft blue clouds near outer edges, sparse blue snowflakes at sides, normal-proportion snow-covered bare trees along the outer left and right edges, snow-dusted wood fence at bottom left, snowy rocks at bottom right, and a LOW U-shaped snowy ground border. Keep the middle a quiet warm cream paper background for UI, no text or interface drawn into the artwork. Do not add objects or characters. Reposition and scale the existing elements naturally to fit; never stretch, distort, crop-to-fit, tile, mirror or create a montage. Preserve the same balanced edge-framing scene and soft winter blue, warm cream, ochre and brown palette.
Output: ONE image only, very wide landscape 12:5 canvas, requested pixel size 2400 by 1000.
Composition: This is an ULTRAWIDE monitor adaptation. Increase the cream central negative space horizontally and put the existing winter decorations at far left and far right edges. The quiet open center spans around 80% of canvas width. Keep the smiling sun circular, with compact sun and branch placement in upper corners; trees remain natural proportions. A LOW U-shaped snowy ground border spans bottom, just 6–8% high in the middle, rising only near the far bottom corners. Keep the fence bottom left and snowy rocks bottom right. Create one coherent full ultrawide canvas, never a stretched source, cropped source, tiled background or montage.

### Saved outputs and validation

All outputs were inspected visually: recognizable original winter motifs, natural sun and tree proportions, quiet cream center, low U-shaped snowy border. Built-in imagegen returned dimensions near the requested dimensions with the requested aspect ratios.

- `public/assets/backgrounds/group-selection-winter-tablet.png`: 1086 × 1448 (3:4).
- `public/assets/backgrounds/group-selection-winter-desktop.png`: 1672 × 941 (approximately 16:9).
- `public/assets/backgrounds/group-selection-winter-ultrawide.png`: 1942 × 809 (approximately 12:5).

Original source was preserved. All final outputs were copied into the project without resizing or stretching.

### group-selection-winter-tablet-landscape.png (1536×1152 requested)

Mode: built-in imagegen edit, followed by one targeted correction for the sun's edge clearance.

#### Initial prompt

Use case: precise-object-edit.
Asset type: responsive illustrated website background for landscape tablets.
Input images: Image 1 is the edit target, the original winter group-selection background.
Primary request: Recompose the original winter illustration onto one landscape 4:3 canvas; requested pixel size 1536 by 1152. Preserve the scene's recognizable objects, soft watercolor paper texture and winter blue, cream, ochre and brown palette.
Composition: Widen the quiet warm cream central UI space and frame it with compact existing decorations at the outer edges. Keep the smiling ROUND yellow sun at the upper right FULLY VISIBLE with all its rays. Inset the entire sun including all rays from both the top edge and the right edge by at least 3% of the canvas width; this safety inset lets nearby tablet ratios crop a small edge without clipping any ray. Preserve the snow-covered branch entering from upper left, soft blue clouds near edges, sparse blue snowflakes along sides, natural-proportion snowy bare trees at far left and far right, snowy fence at bottom left and snowy rocks at bottom right. Reposition and scale these objects naturally to the new 4:3 ratio.
Keep the snowy ground LOW in a shallow U-shaped bottom border, around the bottom 7–9% at the center, rising only toward bottom corners. Leave the broad central approximately 80% of canvas clear cream for UI.
Invariants: One coherent illustration; same source visual identity; normal circular sun and natural tree proportions; all original motifs preserved; no text, interface, new characters or new objects. Do not crop-to-fit the source, stretch, distort, tile, mirror, or create a montage. Generate directly at landscape 4:3.

#### Final correction prompt

Use case: precise-object-edit.
Image 1 is the edit target: the already adapted winter landscape tablet background at 4:3.
Preserve this exact 4:3 canvas, all pixels' visual appearance, layout, object sizes and watercolor texture as closely as possible. Make ONE targeted correction only: move the entire smiling sun together with ALL of its yellow rays slightly left and downward. The outermost rays must have generous cream margins of at least 4% of the total canvas width from both the TOP and RIGHT canvas edges (roughly 58 pixels on the supplied 1448-pixel-wide canvas). Currently those gaps are too small. Translate the sun group without scaling it, so its circular natural proportions and cheerful expression remain unchanged. Fill the old sun position seamlessly with matching cream paper background. Keep all clouds, branch, snowflakes, trees, fence, rocks, low snow border and center completely unchanged. Output one full landscape 4:3 image, requested1536x1152. No new objects, text, cropping, stretching, montage or extra panels.

Saved output: `public/assets/backgrounds/group-selection-winter-tablet-landscape.png` (1448×1086, exact 4:3). Visually inspected: all winter motifs retained; complete round sun plus all rays comfortably inset from top and right; clear cream UI center and low snow border. Original source preserved.
