import { useId } from "react";

import "./StudentAvatar.css";
import type { StudentAvatarProps } from "./types";

const StudentAvatar = ({ photoDataUrl, className }: StudentAvatarProps) => {
  const faceId = useId();

  return (
    <span
      aria-hidden="true"
      className={["student-avatar", className].filter(Boolean).join(" ")}
    >
      <svg
        className="student-avatar__body"
        viewBox="40 125 1190 990"
        focusable="false"
      >
        <image href="/assets/mascots/ladybug.png" width="1254" height="1254" />
      </svg>
      {photoDataUrl && (
        <svg
          className="student-avatar__photo"
          viewBox="40 125 1190 990"
          focusable="false"
        >
          <defs>
            <clipPath id={faceId}>
              <path d="M650 685C640 603 682 538 771 513C842 493 894 521 937 559C970 502 1026 470 1080 491C1148 521 1173 596 1166 677C1160 773 1080 842 983 867C877 896 759 862 697 803C664 771 650 730 650 685Z" />
            </clipPath>
          </defs>
          <image
            href={photoDataUrl}
            x="642"
            y="432"
            width="530"
            height="530"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${faceId})`}
          />
        </svg>
      )}
    </span>
  );
};

export default StudentAvatar;
