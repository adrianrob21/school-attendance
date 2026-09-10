# Responsive summer background prompts

Method: built-in `image_gen` edits of [the original summer background](../public/assets/backgrounds/group-selection-summer.png).
Purpose: fit laptop and ultrawide screens with minimal cropping, no bars, and proportional illustration details.

Saved outputs: [desktop](../public/assets/backgrounds/group-selection-summer-desktop.png), 1672 × 941 (approximately 16:9); [ultrawide](../public/assets/backgrounds/group-selection-summer-ultrawide.png), 1942 × 809 (approximately 2.4:1). The tool returned these resolutions while matching the requested aspect ratios.

## desktop

```text
Use case: precise-object-edit / background-extension. Edit the supplied kindergarten meadow background into a NEW wider canvas. Keep the same storybook hand-painted artwork, friendly smiling sun, warm cream paper center, branch at top left, soft clouds, trees at both outer sides, fence bottom left, rocks bottom right, and low curved green meadow/flower border. This is the same scene adapted to a wider screen. Extend the empty central area horizontally and naturally extend the bottom meadow; move the corner decorations outward to the new canvas edges. Preserve normal round sun and flower proportions: DO NOT stretch the original artwork and DO NOT zoom in or crop off the corners. Keep all seasonal objects completely inside the canvas except the original naturally entering branch and foreground fence edge. The complete border scene should be visible, with a large quiet center for UI. Avoid any tiled/repeated-looking plants, visible seams, mirrored scenery, vertical strips, frames, padding bars, text, logos, controls, cards, characters, and watermarks. Opaque full bleed background, not transparent. Preserve the summer theme of the source.
OUTPUT REQUIRED: one full-bleed landscape image, EXACT 16:9 aspect ratio, 2048 pixels wide by1152 pixels high. Change the canvas aspect ratio from the reference to16:9. Maintain the original quiet center and low meadow border shape.
```

## ultrawide

```text
Use case: precise-object-edit / background-extension. Edit the supplied kindergarten meadow background into a NEW wider canvas. Keep the same storybook hand-painted artwork, friendly smiling sun, warm cream paper center, branch at top left, soft clouds, trees at both outer sides, fence bottom left, rocks bottom right, and low curved green meadow/flower border. This is the same scene adapted to a wider screen. Extend the empty central area horizontally and naturally extend the bottom meadow; move the corner decorations outward to the new canvas edges. Preserve normal round sun and flower proportions: DO NOT stretch the original artwork and DO NOT zoom in or crop off the corners. Keep all seasonal objects completely inside the canvas except the original naturally entering branch and foreground fence edge. The complete border scene should be visible, with a large quiet center for UI. Avoid any tiled/repeated-looking plants, visible seams, mirrored scenery, vertical strips, frames, padding bars, text, logos, controls, cards, characters, and watermarks. Opaque full bleed background, not transparent. Preserve the summer theme of the source.
OUTPUT REQUIRED: one very wide full-bleed landscape image, EXACT12:5 aspect ratio (2.4:1, ultrawide), 3072 pixels wide by1280 pixels high. Change the canvas aspect ratio from the reference to12:5. The middle needs extra horizontal breathing room while the sun, branches, side trees, fence and rocks retain their moderate original proportions and stay at the outer edges.
```
