# Card mascot extraction

Method: built-in `image_gen`, editing the [approved carousel](concepts/group-selection-v4-carousel.png).
Output: [ladybug.png](../public/assets/mascots/ladybug.png).

The initial transparency requests produced opaque checkerboard pixels. The final asset uses a clean white background, blended into the preview card with CSS `mix-blend-mode: multiply`.

```text
Use case: background-extraction / precise-object-edit. Extract the large friendly ladybug mascot from the CENTER pink card of this kindergarten webpage image into ONE standalone transparent PNG asset. Preserve the exact same hand-painted storybook ladybug character: red shell with black spots, round black head, cream face, rosy cheeks, smiling mouth, shiny black eyes, two antennae, six tiny legs, proportions and pose facing to the right. Remove absolutely everything else: page, cards, text, controls, sun, clouds, plants, bee, butterfly. Transparent alpha background, no colored rectangle, no checkerboard drawn into the image, no text, no props, no ground or drop shadow. Center the isolated ladybug in a square image with modest 8% transparent padding, entirely visible and not cropped. It must retain the original character identity and illustrated watercolor texture. This will be used as the image inside a reusable React Card, so only the ladybug pixels should be opaque.
```

Final cleanup prompt, applied to the generated isolated mascot:

```text
Edit this isolated ladybug image: replace ALL of the gray-and-white checkerboard surrounding the ladybug with a perfectly uniform solid pure white #FFFFFF background. This output should be opaque white, NOT transparent and NOT checkerboard. Keep the ladybug itself, its pose, size, placement, antennae, legs and watercolor textures identical. No shadow, no floor line, no gray pixels outside the silhouette, no text. White canvas only outside the insect. Keep same image dimensions.
```
