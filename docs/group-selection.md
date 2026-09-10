# Group selection page

The app opens on the group selection page at `/`. It is also available at `/groups`. Ladybugs is the only available group for now. The existing sign-in scaffold remains at `/sign-in`, and the Card/Button gallery remains at `/components`.

## Design and navigation

The page follows the approved storybook concept: “Choose your group”, a short introduction, a centered blush Card with the Ladybugs mascot, and an explicit **Enter group** Button. It uses the same bundled DynaPuff typography. Only the insect appears inside the card; the meadow decoration stays in the background.

**Enter group** opens the existing Ladybugs welcome page at `/welcome`. Its **Choose a group** link returns to `/groups`. The welcome page's student-entry dialog remains a temporary preview; this change does not add student storage or attendance records.

The shared `meadow-background` class uses the previously approved summer illustrations, switching between the original, desktop, and ultrawide compositions according to viewport proportions. It fills the viewport without bars. Content spacing and mascot height adapt to shorter screens, with natural scrolling available when needed for small windows or enlarged text.

## Adding groups

Group definitions live in `src/process/constants/groups.ts`. Each entry has a stable ID, translation key, mascot image, Card tone, and welcome route. Additional groups should supply their own illustrations, English/Romanian labels, and working welcome destinations.

`GroupCarousel` is built on the reusable Card and Button components. It hides arrows and pagination for one group. With multiple groups, it enables previous/next buttons, group indicators, keyboard navigation (Left, Right, Home, End), and horizontal touch swipes. Browsing changes the active card; only **Enter group** navigates. It does not autoplay and respects reduced-motion preferences.

The page supplies translated labels and an entry callback. Card sizing can be adjusted with the carousel's CSS custom properties: `--group-card-width`, `--group-card-art-height`, `--group-card-padding`, `--group-card-gap`, and `--group-card-title-size`.

## Validation

Production build and ESLint pass; the existing React Hook Form compatibility warning remains. Browser checks verified root and direct `/groups` entry, keyboard activation, welcome navigation and return, reload and browser history, English/Romanian labels, and the existing private-route redirect to `/sign-in`.

Layout checks covered laptop sizes down to 1366 × 650, desktop and ultrawide sizes up to 3440 × 1440, tablet, and 390px/320px mobile widths. Tested desktop sizes have no page scrolling, and all tested sizes have no horizontal overflow or mascot/title overlap. Very short windows retain natural vertical scrolling. Font/image loading, background selection, reduced motion, and button target sizes were also checked; the existing `/components` preview retains its responsive behavior.

A temporary component harness exercised multiple groups independently of production data: wraparound buttons, arrow/Home/End keys, focus retention, group indicators and announcements, correct entry callbacks, native touch swipes and vertical scrolling, and empty/single-group cases.
