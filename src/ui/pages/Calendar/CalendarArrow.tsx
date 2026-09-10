const CalendarArrow = ({
  direction = "right",
}: {
  direction?: "left" | "right";
}) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-grid",
      placeItems: "center",
      inlineSize: "1em",
      blockSize: "1em",
      flexShrink: 0,
      fontFamily: 'var(--font-playful, "DynaPuff", sans-serif)',
      lineHeight: 1,
      transform: direction === "left" ? "scaleX(-1)" : undefined,
    }}
  >
    →
  </span>
);

export default CalendarArrow;
