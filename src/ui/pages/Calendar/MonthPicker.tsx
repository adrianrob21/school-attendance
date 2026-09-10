import { useTranslation } from "react-i18next";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "Components";

import "./MonthPicker.css";
import TitleArt from "./TitleArt";
import CalendarArrow from "./CalendarArrow";
import StudentIcon from "../Students/StudentIcon";
import { MONTH_THEMES, createCalendarDate } from "./calendar";

interface MonthPickerProps {
  date: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const MonthPicker = ({ date, onSelect, onClose }: MonthPickerProps) => {
  const { t: translate } = useTranslation("general");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selectedMonthRef = useRef<HTMLButtonElement>(null);
  const [yearInput, setYearInput] = useState(String(date.getFullYear()));
  const id = useId();
  const year = Number(yearInput);
  const validYear =
    /^\d{1,4}$/.test(yearInput) &&
    Number.isInteger(year) &&
    year >= 1 &&
    year <= 9999;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const scrollContainer =
      document.scrollingElement instanceof HTMLElement
        ? document.scrollingElement
        : document.documentElement;
    const previousOverflow = scrollContainer.style.getPropertyValue("overflow");
    const previousPriority =
      scrollContainer.style.getPropertyPriority("overflow");

    scrollContainer.style.setProperty("overflow", "hidden");
    dialog?.showModal();
    selectedMonthRef.current?.focus();

    return () => {
      dialog?.close();
      if (previousOverflow) {
        scrollContainer.style.setProperty(
          "overflow",
          previousOverflow,
          previousPriority,
        );
      } else {
        scrollContainer.style.removeProperty("overflow");
      }
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <dialog
      aria-labelledby={`${id}-title`}
      className="calendar-month-picker"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <header className="calendar-month-picker__header">
        <h2 id={`${id}-title`}>{translate("calendar.chooseMonth")}</h2>
        <Button
          aria-label={translate("calendar.close")}
          onClick={onClose}
          shape="circle"
          size="sm"
          variant="secondary"
        >
          <StudentIcon name="close" />
        </Button>
      </header>

      <div className="calendar-month-picker__year-navigation">
        <Button
          aria-label={translate("calendar.previousYear")}
          disabled={!validYear || year <= 1}
          onClick={() => setYearInput(String(year - 1))}
          shape="circle"
          size="sm"
          variant="secondary"
        >
          <CalendarArrow direction="left" />
        </Button>
        <div className="calendar-month-picker__year">
          <label htmlFor={`${id}-year`}>{translate("calendar.year")}</label>
          <input
            aria-invalid={!validYear}
            autoComplete="off"
            id={`${id}-year`}
            inputMode="numeric"
            max={9999}
            min={1}
            onChange={(event) => setYearInput(event.target.value)}
            required
            step={1}
            type="number"
            value={yearInput}
          />
        </div>
        <Button
          aria-label={translate("calendar.nextYear")}
          disabled={!validYear || year >= 9999}
          onClick={() => setYearInput(String(year + 1))}
          shape="circle"
          size="sm"
          variant="secondary"
        >
          <CalendarArrow />
        </Button>
      </div>

      <div className="calendar-month-picker__months">
        {MONTH_THEMES.map((theme, monthIndex) => (
          <button
            aria-pressed={
              year === date.getFullYear() && monthIndex === date.getMonth()
            }
            className="calendar-month-picker__month"
            disabled={!validYear}
            key={theme.key}
            onClick={() => {
              if (!validYear) return;
              onSelect(createCalendarDate(year, monthIndex));
              onClose();
            }}
            ref={monthIndex === date.getMonth() ? selectedMonthRef : undefined}
            type="button"
          >
            <TitleArt
              className="calendar-month-picker__art"
              monthIndex={monthIndex}
            />
            <span>{translate(theme.labelKey)}</span>
          </button>
        ))}
      </div>
    </dialog>
  );
};

export default MonthPicker;
