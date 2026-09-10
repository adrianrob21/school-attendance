# Standalone meadow background — edit prompt

Generation method: built-in `image_gen` tool.
Edit target: [approved carousel, version 4](concepts/group-selection-v4-carousel.png).
Output asset: [group-selection-meadow.png](../public/assets/backgrounds/group-selection-meadow.png).
Purpose: save the illustrated background separately for the React app. Areas covered by the interface are reconstructed from the surrounding illustration.

```text
Use case: precise-object-edit
Asset type: standalone opaque webpage background illustration for a React kindergarten attendance app.
Edit target: the provided approved group-selection carousel screenshot.

Extract/reconstruct ONLY the illustrated page background by removing the entire UI overlay. Output a complete clean background image at the same 1536 × 1024 landscape composition.

REMOVE all text, including header "Kindergarten attendance", title, subtitle, group names and button label. REMOVE the little ladybug logo at the top center. REMOVE all three pastel group cards including their fills, borders and shadows, and remove all three insect mascots from those cards. REMOVE both red navigation arrows, the Enter group button, all four pagination indicators and every other interface element or mark.

PRESERVE as faithfully as possible the existing visible background illustration: the leafy branch entering from the upper left; softly painted light-blue clouds; the cheerful yellow smiling sun in the upper right; drifting green leaves at the outer sides; distant trees at both sides; rolling green meadow borders sloping inward along the bottom; small daisies and meadow plants; wooden fence at the lower left; gray rocks at the lower right; the warm pale cream paper-textured open center. Keep the same positions, shapes, colors, gentle paper texture and hand-painted storybook style. Do not redesign or move background elements.

Fill the areas formerly hidden by the UI seamlessly with the surrounding warm cream lightly textured background. Continue any meadow border or distant tree edge only where necessary for natural continuity. Preserve a LARGE QUIET UNCLUTTERED CREAM CENTER and upper-middle area for future interface elements; do not fill the center with scenery, horizon lines, more trees, animals, decorations, or flowers. The meadow frames the outer edges and bottom just as in the reference.

Constraints: background illustration only, zero text or lettering, zero logos, zero cards, zero buttons, zero arrows, zero indicators, zero foreground insect mascots, no watermark, no device frame. Opaque full-canvas PNG background, not transparent. Maintain original canvas framing and aspect ratio.
```
