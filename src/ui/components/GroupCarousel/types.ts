import type { CardProps } from "../Card/types";

export interface GroupOption {
  id: string;
  name: string;
  illustrationSrc: string;
  tone?: CardProps["tone"];
}

export interface GroupCarouselProps {
  groups: readonly GroupOption[];
  onEnterGroup: (group: GroupOption) => void;
  labels: {
    region: string;
    enterGroup: string;
    previous: string;
    next: string;
    selectGroup: (name: string) => string;
    position: (current: number, total: number) => string;
  };
}

export interface SwipeStart {
  pointerId: number;
  x: number;
  y: number;
}
