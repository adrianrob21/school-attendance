// Natural illustrations for page titles, without the day markers' number spaces.
// Source-centered crops keep the complete paintings clear of neighboring art.
const centers = [
  [187, 202],
  [545, 212],
  [915, 209],
  [1265, 204],
  [188, 535],
  [544, 534],
  [910, 538],
  [1273, 540],
  [176, 874],
  [546, 872],
  [909, 878],
  [1262, 879],
];

const TitleArt = ({
  monthIndex,
  className = "",
}: {
  monthIndex: number;
  className?: string;
}) => {
  const [x, y] = centers[monthIndex] ?? centers[0];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`calendar-title-art ${className}`}
      style={{ mixBlendMode: "multiply", overflow: "hidden" }}
      viewBox={`${x - 160} ${y - 160} 320 320`}
    >
      <image
        href="/assets/calendar/seasonal-title-decorations.png"
        width="1448"
        height="1086"
      />
    </svg>
  );
};

export default TitleArt;
