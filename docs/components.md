# Card and Button

Open `/components` while running `yarn start` to review the components. Use a supported Node 22 release (22.23.2 is installed in this workspace's environment). The preview is separate from the existing sign-in and dashboard routes; its buttons provide demo feedback.

## Typography

Both components use the locally bundled **DynaPuff** variable font through `--font-playful`, with weight 700 for card titles and 600 for buttons. This is a visual match for the generated concept's rounded lettering; the image does not identify an exact font file.

The font is imported by `src/index.css`, with its [SIL Open Font License](../src/ui/assets/fonts/OFL-DynaPuff.txt) included. Source: [Google Fonts DynaPuff](https://github.com/google/fonts/tree/main/ofl/dynapuff). It includes Latin Extended characters for Romanian copy.

## Example

```tsx
import { Button, Card } from "Components";

<Card
  footer={
    <Button onClick={openGroup} size="lg">
      Enter group
    </Button>
  }
  illustration={<img alt="" src="/assets/mascots/ladybug.png" />}
  selected
  title="Ladybugs"
  tone="rose"
/>;
```

The illustration is optional and can be any React node. Keep it to the animal or insect alone, following the approved design. The Ladybugs preview uses a white-backed illustration with `mix-blend-mode: multiply` to blend into the pastel card. Other illustrations can use true transparency. The Card does not apply blending automatically.

## Card

- `title`: required group/card heading; used to label the native `article`.
- `tone`: `rose` (default), `honey`, `lavender`, `sage`, or `cream`.
- `illustration`, `children`, `footer`: optional composable content slots.
- `selected`: optional visual emphasis. This does not turn the card into an interactive control.
- Native article attributes, handlers, `className`, and React 19 refs are forwarded.

Place a Button in `footer` to enter a group. Keep the Card itself a non-interactive container so controls are not nested inside another control. Override `--card-illustration-height` to adjust the art slot in a particular layout.

## Button

- `variant`: `primary` (default) or `secondary`.
- `size`: `sm`, `md` (default), or `lg`; all offer at least 44px targets.
- `shape`: `pill` (default) or `circle`.
- `fullWidth`: fills the container for pill buttons; circle buttons remain circular.
- Native button attributes, events, `disabled`, `className`, and React 19 refs are forwarded.
- `type` defaults to `button`; pass `type="submit"` explicitly for forms.

Circle buttons containing only an icon need an accessible name, for example `aria-label="Next group"`, and their decorative SVG should use `aria-hidden="true"`. Both variants include hover, pressed, keyboard focus, disabled, and reduced-motion styles.

The mascot was generated with built-in imagegen; its [prompt](ladybug-component-image-prompt.md) is saved separately.

## Responsive preview layout

The background fills the viewport with centered, non-repeating `cover` sizing. To avoid bars and excessive cropping, it selects a composition matched to the screen: the original 3:2 summer image for portrait/squarer windows, a 16:9 version from a 3:2 viewport ratio, and a 2.4:1 version from a 2:1 viewport ratio. The background stays fixed to the viewport so taller page content does not enlarge it. The wider illustrations extend the scene without stretching its details.

Desktop windows at least 1000px wide use compact spacing below 1000px in height, with an additional spacing adjustment below 700px. The mascot responds to viewport height and specimen labels move beside the buttons; button targets retain their original sizes. Narrow or unusually short windows retain natural scrolling so content stays reachable.

Responsive assets: [desktop, 1672 × 941](../public/assets/backgrounds/group-selection-summer-desktop.png) and [ultrawide, 1942 × 809](../public/assets/backgrounds/group-selection-summer-ultrawide.png). Both were made with built-in imagegen; [exact prompts](responsive-background-image-prompts.md) are saved. These variants apply to the summer background used by the component preview and [group selection page](group-selection.md), through the shared `meadow-background` class.

The updated layout was checked at 1440 × 800, 1512 × 850, 1280 × 720, 1366 × 650, 1024 × 768, 1920 × 1080, 2560 × 1080, and 3440 × 1440 with no page overflow. Mobile and short-window checks confirmed accessible scrolling and no horizontal overflow.

## Validation

Production build and ESLint pass. ESLint retains the scaffold's existing React Hook Form/React Compiler compatibility warning. A one-line Redux action payload type was corrected to match the scaffold's existing saga and unblock the build.

Local Chromium checks cover desktop (1440px), mobile (390px and 320px), font and image loading, button activation by mouse and keyboard, disabled buttons being skipped by Tab, accessible icon labels, 44px tap targets, reduced-motion behavior, and absence of overflow or image/title overlap. No browser errors were reported.
