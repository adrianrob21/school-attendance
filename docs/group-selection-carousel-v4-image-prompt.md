# Carousel cards with mascots only — edit prompt

Generation method: built-in `image_gen` tool.
Edit target: [carousel version 3](concepts/group-selection-v3-carousel.png).
Requested refinement: keep only insects or animals in the card illustrations; remove flowers and plants inside the cards.

```text
Use case: precise-object-edit
Asset type: refinement of an existing kindergarten attendance group carousel webpage.
Edit target: the attached carousel page. Make a strictly localized edit to the decorative artwork INSIDE the three group cards only.

User request: keep only the insects / animals, no flowers, inside the cards.

Inside the blush Ladybugs card: remove every flower, daisy, stem, leaf (including the large leaf the ladybug stands on), grass, bush, plant, habitat scenery, and the small floating heart. Preserve the ladybug itself exactly: same red-and-black spotted shell, friendly face, rosy cheeks, antennae, little legs, size, pose, position, hand-painted texture and character identity. Fill the removed decoration with the existing soft blush-pink card background. A very subtle contact shadow under the mascot is fine.
Inside the honey-yellow Bees card: remove the yellow flower and all leaves, stems, foliage, grass and decorative flight trail. Preserve the bee itself in the same location, scale and style. Fill removed elements with the existing soft yellow card background.
Inside the lavender Butterflies card: remove all floral sprigs, grass, leaves, stems, foliage, and decorative flying trails or floating marks. Preserve the butterfly itself, including its antennae and wing patterns, in the same location, scale and style. Fill removed elements with the existing soft lavender card background.

IMPORTANT: The cards must still contain their original group labels and controls. Keep the words "Ladybugs", "Bees", "Butterflies", and the coral "Enter group" button exactly as before. The request to keep only animals concerns decorative illustration, not UI text or controls.

Preserve EVERYTHING outside the card interiors as faithfully as possible: all meadow flowers, grasses, trees, leaves, fence, rocks, sun, clouds and page background; the small header ladybug; exact text "Kindergarten attendance", "Choose your group", and "Pick your little team to get started."; both carousel navigation arrows; four pagination indicators with second active; card borders, shapes, sizes, positions, perspective, pastel colors, shadows, layout, composition and rounded typography. Keep the entire 3:2 landscape image and existing high-quality storybook illustration style. Do not redesign, rearrange, add objects, or add any text. Output the complete revised webpage image.
```
