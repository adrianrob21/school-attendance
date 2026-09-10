import { WELCOME_PATH } from "./navigation-paths";

export const KINDERGARTEN_GROUPS = [
  {
    id: "ladybugs",
    nameKey: "groupSelection.groups.ladybugs",
    illustrationSrc: "/assets/mascots/ladybug.png",
    tone: "rose",
    welcomePath: WELCOME_PATH,
  },
] as const;
