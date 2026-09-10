import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";

import Card from "../Card";
import "./GroupCarousel.css";
import Button from "../Button";
import type { GroupCarouselProps, SwipeStart } from "./types";

const GroupCarousel = ({
  groups,
  onEnterGroup,
  labels,
}: GroupCarouselProps) => {
  const [selectedId, setSelectedId] = useState(groups[0]?.id);
  const swipeStart = useRef<SwipeStart | null>(null);
  const suppressClick = useRef(false);
  const activeIndex = Math.max(
    0,
    groups.findIndex((group) => group.id === selectedId),
  );
  const activeGroup = groups[activeIndex];
  const hasMultipleGroups = groups.length > 1;
  const previousGroup =
    groups[(activeIndex - 1 + groups.length) % groups.length];
  const nextGroup = groups[(activeIndex + 1) % groups.length];

  const move = (direction: number) => {
    const nextIndex = (activeIndex + direction + groups.length) % groups.length;
    setSelectedId(groups[nextIndex]?.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    suppressClick.current = false;

    if (!hasMultipleGroups || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "Home":
        event.preventDefault();
        setSelectedId(groups[0].id);
        break;
      case "End":
        event.preventDefault();
        setSelectedId(groups[groups.length - 1].id);
        break;
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    suppressClick.current = false;
    swipeStart.current =
      hasMultipleGroups && event.isPrimary && event.pointerType === "touch"
        ? { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
        : null;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (!start || event.pointerId !== start.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) >= 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      suppressClick.current = true;
      move(deltaX > 0 ? -1 : 1);
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (suppressClick.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    }
  };

  if (!activeGroup) {
    return null;
  }

  return (
    <section
      aria-label={labels.region}
      className="group-carousel"
      data-multiple={hasMultipleGroups || undefined}
      onClickCapture={handleClickCapture}
      onKeyDown={handleKeyDown}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      tabIndex={hasMultipleGroups ? 0 : undefined}
    >
      <div className="group-carousel__stage">
        {groups.length > 2 && (
          <div
            aria-hidden="true"
            className="group-carousel__neighbor group-carousel__neighbor--previous"
          >
            <Card
              illustration={<img alt="" src={previousGroup.illustrationSrc} />}
              title={previousGroup.name}
              tone={previousGroup.tone}
            />
          </div>
        )}

        <Card
          className="group-carousel__card"
          footer={
            <Button onClick={() => onEnterGroup(activeGroup)} size="lg">
              {labels.enterGroup}
              <span aria-hidden="true">→</span>
            </Button>
          }
          illustration={
            <img
              alt=""
              className="group-carousel__mascot"
              draggable={false}
              key={activeGroup.id}
              src={activeGroup.illustrationSrc}
            />
          }
          title={activeGroup.name}
          tone={activeGroup.tone}
        />

        {groups.length > 2 && (
          <div
            aria-hidden="true"
            className="group-carousel__neighbor group-carousel__neighbor--next"
          >
            <Card
              illustration={<img alt="" src={nextGroup.illustrationSrc} />}
              title={nextGroup.name}
              tone={nextGroup.tone}
            />
          </div>
        )}
      </div>

      {hasMultipleGroups && (
        <div className="group-carousel__navigation">
          <Button
            aria-label={labels.previous}
            onClick={() => move(-1)}
            shape="circle"
            variant="secondary"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="m14.5 5-7 7 7 7" />
            </svg>
          </Button>

          <div className="group-carousel__dots">
            {groups.map((group, index) => (
              <button
                aria-label={labels.selectGroup(group.name)}
                aria-pressed={index === activeIndex}
                className="group-carousel__dot"
                key={group.id}
                onClick={() => setSelectedId(group.id)}
                type="button"
              >
                <span />
              </button>
            ))}
          </div>

          <Button
            aria-label={labels.next}
            onClick={() => move(1)}
            shape="circle"
            variant="secondary"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="m9.5 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      {hasMultipleGroups && (
        <p
          aria-atomic="true"
          className="group-carousel__position"
          role="status"
        >
          <span className="group-carousel__visually-hidden">
            {activeGroup.name}.{" "}
          </span>
          {labels.position(activeIndex + 1, groups.length)}
        </p>
      )}
    </section>
  );
};

export default GroupCarousel;
