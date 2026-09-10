import type { RefObject } from "react";
import { useEffect, useState } from "react";

import type { RosterLayout } from "./RosterLayout/types";

const MIN_ROW_HEIGHT = 135;
const MAX_ROWS = 4;

const fitRoster = (
  width: number,
  height: number,
  rowGap: number,
  rowHeight: number,
  minColumnWidth: number,
  columnGap: number,
): RosterLayout => {
  const columns =
    minColumnWidth > 0
      ? Math.max(
          1,
          Math.min(
            6,
            Math.floor((width + columnGap) / (minColumnWidth + columnGap)),
          ),
        )
      : width >= 900
        ? 6
        : width >= 600
          ? 4
          : width >= 440
            ? 3
            : width >= 270
              ? 2
              : 1;
  const rows = Math.max(
    1,
    Math.min(MAX_ROWS, Math.floor((height + rowGap) / (rowHeight + rowGap))),
  );
  return { columns, rows, pageSize: columns * rows };
};

export const useRosterLayout = (
  rosterRef: RefObject<HTMLElement | null>,
): RosterLayout => {
  const [layout, setLayout] = useState<RosterLayout>({
    columns: 1,
    rows: 1,
    pageSize: 1,
  });
  // Observe the always-mounted viewport, so loading and empty states do not
  // change the available grid capacity or require a new subscription.
  useEffect(() => {
    const element = rosterRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const style = window.getComputedStyle(element);
      const rowGap = Number.parseFloat(style.rowGap) || 0;
      // Match the rendered cards at each breakpoint; larger tablet controls
      // must reduce page capacity instead of being clipped below the viewport.
      const rowHeight =
        Number.parseFloat(style.getPropertyValue("--attendance-row-height")) ||
        MIN_ROW_HEIGHT;
      const minColumnWidth =
        Number.parseFloat(
          style.getPropertyValue("--attendance-min-column-width"),
        ) || 0;
      const columnGap = Number.parseFloat(style.columnGap) || 0;
      const next = fitRoster(
        entry.contentRect.width,
        entry.contentRect.height,
        rowGap,
        rowHeight,
        minColumnWidth,
        columnGap,
      );
      setLayout((current) =>
        current.columns === next.columns && current.rows === next.rows
          ? current
          : next,
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [rosterRef]);

  return layout;
};
