# Students page concept — version 1

Output: [Students page concept](concepts/students-page-v1.png).

Generation method: built-in `image_gen` tool.

Visual references:
- [Approved group carousel](concepts/group-selection-v4-carousel.png)
- [Garden welcome concept](concepts/ladybugs-welcome-v3-garden-desktop.png)

## Design

A flower-trimmed title panel sits above a shared framed class roster. Students appear as named ladybugs. Four fictional photo faces and two default illustrated faces demonstrate that photos are optional. The selected student's editor shows the name field, photo upload, circular crop, save action, and delete control.

The mockup uses English, matching the existing concept images. Names and portraits are fictional examples.

## Intended interactions

- **Add student** opens an empty editor on this page. A first name is required; a photo is optional. Saving adds the ladybug to the class.
- Selecting a ladybug or its pencil action opens that student's editor.
- **Upload photo** lets the teacher choose an image, then position and zoom it inside a circular mask. The saved crop replaces only the mascot's face, retaining the illustrated head border and antennae.
- **Save changes** applies edits. Without a photo, the ladybug keeps the default illustrated face.
- **Delete student** opens a confirmation naming the selected student before removing them from the class.
- The roster scrolls within the body frame for larger classes. On narrow screens, the editor opens as a sheet and the roster uses fewer columns.
- An empty class retains both frames, with an invitation to add the first student.

This deliverable is a visual concept. The app currently uses a temporary student-setup dialog; implementing the dedicated page, photo storage, and persistent student management is subsequent work.

## Generation prompt

```text
Use case: ui-mockup.
Asset type: a high-fidelity desktop Students page concept for the existing Ladybugs kindergarten attendance app. Generate one complete polished webpage screenshot in a landscape 3:2 composition, around 1536 x 1024.

Input images: Image 1, group-selection-v4-carousel.png, is the reference for established watercolor storybook illustration, meadow background, rounded typography, coral buttons, blush panels, and ladybug character identity. Image 2, ladybugs-welcome-v3-garden-desktop.png, is a supporting reference for delicate cream frames, warm brown text, layered garden flowers and refined spacing. They are style references for a NEW sibling page, not edit targets.

Primary request: a students management page composed of a flower-decorated TITLE PANEL and a large BODY FRAME containing students represented by illustrated ladybugs. The teacher can add students, select one, upload a photograph so the child's face appears in the ladybug's face opening, and delete a student. Show the populated class with a selected-student editor, all clearly legible in one screenshot.

Scene/backdrop: preserve the existing app's softly textured warm ivory sky, pale blue watercolor clouds, leafy branch at upper left, friendly smiling sun at upper right, gentle green meadow and daisies around the lower perimeter. Keep this scenery subordinate to the functional UI. Small centered ladybug emblem and header "Kindergarten attendance". Small cream pill "Back to group" at upper left, below the branch.

Composition:
1. Center a wide shallow warm-cream title plaque below the header, occupying roughly x=210..1326, y=125..270 on the 1536 x 1024 canvas. It has generous rounded corners, a delicate peach double-outline and soft shadow. Asymmetrical hand-painted daisies, poppies, small blue cornflowers and green leaves hug the two ends and top corners, leaving every letter unobstructed. Large plump DynaPuff-like dark brown heading "Our little ladybugs", centered, with smaller subtitle "A little face for every ladybug." below.
2. Below the title panel, a large rounded blush-ivory body frame at roughly x=100..1436, y=305..905. Give it a substantial but elegant pale peach rim, a fine inset line, softly painted texture and subtle shadow. A few flowers decorate only the exterior lower corners. The entire roster belongs to ONE shared frame, with comfortable space around each ladybug rather than individual rectangular cards.
3. Body toolbar: "6 students" at upper left and a clear coral pill "+ Add student" toward the right of the roster area. A slim vertical divider separates the roster (left two-thirds of body) from the selected-student editor (right third).
4. Roster: six charming, generously sized ladybugs in an orderly 3-column x 2-row arrangement, aligned with readable cream name pills below. Names, in row order: "Sofia", "Andrei", "Maria", "Luca", "Emma", "Matei". Preserve the reference mascot's red spotted shell, black head rim, two antennae, little legs and hand-painted shading; use a slightly turned front-facing pose so the face opening is clearly visible. Sofia, Andrei, Maria and Emma show natural smiling FICTIONAL child photo portraits inside circular face openings. The crops show the human face and hair, smoothly masked at the head boundary; retain the black head rim and antennae as a playful paper-craft photo frame. Photo faces are intentionally photographic against the watercolor insect body, natural and charming. NO drawn human bodies, no extra cartoon eyes or mouth over a child's face, no literal biological human-insect hybrid. Luca and Matei retain the normal cream smiling illustrated mascot face, with a small camera badge indicating an optional photo. Each photo face should be large enough to recognize. Select Sofia with a very pale sage oval background and a fine sage outline; all other bugs rest directly on the shared cream background. Add a tiny pencil action beside each name, visually quiet.
5. Right-side editor is integrated inside the body frame with an ivory background, generous padding and fine peach divider. Heading "Edit student". Beneath, label "First name" and a rounded text input containing "Sofia". Then label "Student photo", a centered circular crop preview of the SAME fictional Sofia portrait shown on her ladybug, a small simple zoom slider with minus and plus symbols, a cream outlined camera button labeled "Upload photo", and short helper "Photos are optional." Below, a coral pill "Save changes". At the bottom, leave breathing room and show a small red trash icon with the explicit text button "Delete student". Keep the delete action visually secondary and separated from saving.
6. Do not cover the class with a modal. This is the normal page with its selected-student editor open. Keep every control and all six student name labels entirely visible, well spaced, with no overlaps.

Typography and finish: match the existing soft illustrated app, dark warm brown plump headings, friendly highly readable rounded UI labels, coral-red primary buttons with white text, cream and muted peach borders, restrained sage selection accent. Flowers belong to the title panel and external frame edges; keep the center of the roster spacious and calm. Beautiful professional product-design mockup with cohesive hand-painted children's storybook finish.

Exact visible text: "Kindergarten attendance"; "Back to group"; "Our little ladybugs"; "A little face for every ladybug."; "6 students"; "+ Add student"; "Sofia"; "Andrei"; "Maria"; "Luca"; "Emma"; "Matei"; "Edit student"; "First name"; "Student photo"; "Upload photo"; "Photos are optional."; "Save changes"; "Delete student".
Constraints: one complete landscape desktop page, no browser chrome, device mockup, watermark, annotation arrows, UI design commentary, attendance checkmarks, attendance status colors, dates, calendar, extra students, metrics, or unrelated actions. All six students must be LADYBUGS with name labels. Prioritize the two framed panels, useful management controls, beautiful flowers on the title frame, and clear face-photo compositing.
```

