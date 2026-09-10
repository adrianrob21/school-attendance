// Source coordinates follow measured cream-region centroids, not object bounds.
// Cropping at display time also excludes neighboring objects in the shared atlas.
const centers = [
  [183, 191],
  [482, 193],
  [772, 191],
  [1072, 194],
  [181, 465],
  [478, 465],
  [774, 468],
  [1072, 468],
  [174, 775],
  [473, 779],
  [767, 783],
  [1070, 769],
  [177, 1040],
  [479, 1031],
  [779, 1055],
  [1070, 1039],
];

const CalendarArt = ({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) => {
  const [x, y] = centers[index] ?? centers[0];
  return (
    <svg
      aria-hidden="true"
      className={`calendar-art ${className}`}
      viewBox={`${x - 135} ${y - 135} 270 270`}
    >
      <image
        href="/assets/calendar/seasonal-markers.png"
        width="1254"
        height="1254"
      />
    </svg>
  );
};

export default CalendarArt;
