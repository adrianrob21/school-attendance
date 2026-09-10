# Animated Ladybugs Welcome Page

Run the app with `yarn start` using Node 22, then open `/welcome`. This working first-visit concept follows the [approved group-selection design](concepts/group-selection-v4-carousel.png).

The current version centers the animated ladybug above exactly two Welcome Page buttons: **Manage Students** and **Go to calendar**. The header branding, pause control, invitation card, garden extras, replay, and group-navigation controls have been removed. The meadow background, welcome heading, video animation, and English/Romanian copy remain.

## Animation from the supplied video

The mascot uses the user's [No_I_want_a_video_please.mp4](../No_I_want_a_video_please.mp4). The original file is unchanged.

The 1280 × 720, 10.005-second video was sampled into 120 frames at 12 fps. A fixed 700px square crop preserves the original wing movement and bobbing. Green-screen keying and edge despill produce real transparency. The runtime [WebP atlas](../public/assets/welcome/ladybug-video-atlas.webp) contains 256px cells in a 10 × 12 grid and is about 1.30 MB. It plays as a ten-second CSS frame loop. [Extraction metadata](../public/assets/welcome/ladybug-video-metadata.json), a [transparent poster](../public/assets/welcome/ladybug-video-poster.png), and [sample keyed frames](concepts/ladybug-video-frames.png) are saved separately.

The earlier [generated pose study](concepts/ladybug-animation-study.png) is retained as a design artifact. The live mascot uses the supplied video frames. New scenery was generated from the approved carousel; its [source prompts](ladybugs-garden-assets-image-prompts.md) are saved.

## Actions and motion

- **Manage Students** opens the existing temporary student-manager preview. It supports first-name entry and removal; names last only while that dialog is open. Closing the dialog returns focus to the button.
- **Go to calendar** opens `/calendar`, a calendar preview with month navigation, current-day highlighting, and day selection. The calendar does not yet store or edit attendance.
- The ladybug and clouds animate automatically. The mascot is decorative, so the Welcome Page has no extra interactive controls. Animation pauses while the student dialog is open; reduced motion shows a settled, static scene.

Implementation: [Welcome](../src/ui/pages/Welcome/index.tsx), [layout styles](../src/ui/pages/Welcome/Welcome.css), [video-frame component](../src/ui/pages/Welcome/AnimatedLadybug/index.tsx), [student manager](../src/ui/pages/Welcome/StudentSetup/index.tsx), and [calendar preview](../src/ui/pages/Calendar/index.tsx).

## Visual history

- [Original static welcome](concepts/ladybugs-welcome-v1.png).
- [Earlier animated desktop](concepts/ladybugs-welcome-v2-animated-desktop.png) and [mobile](concepts/ladybugs-welcome-v2-animated-mobile.png).
- [Earlier living garden desktop](concepts/ladybugs-welcome-v3-garden-desktop.png) and [mobile](concepts/ladybugs-welcome-v3-garden-mobile.png), before removal of the leaf-and-flower cluster. Open `/welcome` for the current page.

## Verification

The earlier video extraction and transparent frames were visually checked. Current page checks cover the exact two Welcome buttons, their destinations, keyboard focus, responsive layout, and reduced-motion behavior.
