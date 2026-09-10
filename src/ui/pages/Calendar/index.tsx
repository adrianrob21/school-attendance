import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Button } from "Components";
import { KINDERGARTEN_GROUPS, TODAY_PATH, WELCOME_PATH } from "Constants";

import {
  getDateKey,
  parseDateKey,
  getHoliday,
  shiftMonth,
  MONTH_THEMES,
  getLocalToday,
  getDaysInMonth,
  getCalendarLayout,
  createCalendarDate,
  getBirthdaysForMonth,
} from "./calendar";
import "./Calendar.css";
import TitleArt from "./TitleArt";
import CalendarArt from "./CalendarArt";
import MonthPicker from "./MonthPicker";
import CalendarArrow from "./CalendarArrow";
import { useStudents } from "../../../process/students";

// Use eight rows on phones and tall tablets; shorter tablets fit five rows.
const compactQuery =
  "(max-width: 599px), (max-width: 640px) and (min-height: 800px), (max-width: 1024px) and (min-height: 820px) and (orientation: portrait)";
const subscribeToLayout = (callback: () => void) => {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const isCompactLayout = () => window.matchMedia(compactQuery).matches;

const Calendar = () => {
  const { t: translate, i18n } = useTranslation("general");
  const { students, isLoading, error, reload } = useStudents(
    KINDERGARTEN_GROUPS[0].id,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [today, setToday] = useState(getLocalToday);
  const selectedDate = parseDateKey(searchParams.get("date") ?? "");
  const requestedMonth = parseDateKey(`${searchParams.get("month") ?? ""}-01`);
  const displayedMonth = requestedMonth ?? selectedDate ?? today;
  const [pickerOpen, setPickerOpen] = useState(false);
  const compact = useSyncExternalStore(
    subscribeToLayout,
    isCompactLayout,
    () => false,
  );
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const theme = MONTH_THEMES[month];
  const layout = getCalendarLayout(getDaysInMonth(year, month), compact);
  const birthdays = getBirthdaysForMonth(
    error || isLoading ? [] : students,
    year,
    month,
  );
  const locale = i18n.resolvedLanguage || i18n.language;
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const shortWeekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const fullWeekday = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(displayedMonth);
  const todayKey = getDateKey(today);
  const selectedKey = selectedDate ? getDateKey(selectedDate) : null;

  useEffect(() => {
    const refresh = () => {
      const next = getLocalToday();
      setToday((current) =>
        getDateKey(current) === getDateKey(next) ? current : next,
      );
    };
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const changeMonth = (date: Date) => {
    const next = new URLSearchParams(searchParams);
    next.set("month", getDateKey(date).slice(0, 7));
    setSearchParams(next, { replace: true });
  };
  const returnToToday = () => {
    const current = getLocalToday();
    setToday(current);
    setSearchParams({ date: getDateKey(current) }, { replace: true });
  };

  return (
    <main
      className={`calendar-page calendar-page--${theme.key} meadow-background`}
      data-season={theme.season}
    >
      <svg
        className="calendar-page__filters"
        aria-hidden="true"
        width="0"
        height="0"
      >
        <defs>
          <filter id="calendar-paper-cutout" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -100 -100 -100 0 297"
              result="paperRemoved"
            />
            <feComposite in="paperRemoved" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
      <div className="calendar-page__content">
        <header className="calendar-page__header">
          <Link
            className="calendar-page__back"
            to={WELCOME_PATH}
            aria-label={translate("calendar.back")}
          >
            <CalendarArrow direction="left" />
          </Link>
          <div className="calendar-page__title-panel">
            <TitleArt
              monthIndex={month}
              className="calendar-page__title-art calendar-page__title-art--left"
            />
            <h1>{translate("calendar.title")}</h1>
            <TitleArt
              monthIndex={month}
              className="calendar-page__title-art calendar-page__title-art--right"
            />
          </div>
        </header>

        <section
          className="calendar-page__paper"
          aria-labelledby="calendar-month"
        >
          <div className="calendar-page__toolbar">
            <div className="calendar-page__month-navigation">
              <Button
                aria-label={translate("calendar.previousMonth")}
                disabled={year === 1 && month === 0}
                onClick={() => changeMonth(shiftMonth(displayedMonth, -1))}
                shape="circle"
                size="sm"
                variant="secondary"
              >
                <CalendarArrow direction="left" />
              </Button>
              <h2 id="calendar-month" aria-live="polite" aria-atomic="true">
                <button
                  className="calendar-page__month-button"
                  type="button"
                  aria-label={`${translate("calendar.chooseMonth")}: ${monthLabel}`}
                  aria-haspopup="dialog"
                  onClick={() => setPickerOpen(true)}
                >
                  {monthLabel}
                  <span aria-hidden="true">⌄</span>
                </button>
              </h2>
              <Button
                aria-label={translate("calendar.nextMonth")}
                disabled={year === 9999 && month === 11}
                onClick={() => changeMonth(shiftMonth(displayedMonth, 1))}
                shape="circle"
                size="sm"
                variant="secondary"
              >
                <CalendarArrow />
              </Button>
            </div>
            <Button
              className="calendar-page__today-button"
              onClick={returnToToday}
              size="sm"
            >
              {translate("calendar.today")}
            </Button>
          </div>
          <p className="calendar-page__subtitle">
            {translate("calendar.subtitle")}
          </p>

          <div
            className="calendar-trail"
            data-layout={compact ? "compact" : "wide"}
            key={`${year}-${month}`}
          >
            <svg
              aria-hidden="true"
              className="calendar-trail__path"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              preserveAspectRatio="none"
            >
              <path
                d={layout.path}
                fill="none"
                stroke="#b18a61"
                strokeOpacity=".7"
                strokeWidth="3"
                strokeDasharray="0 10"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <ol className="calendar-trail__days" aria-label={monthLabel}>
              {layout.days.map(({ day, x, y }) => {
                const date = createCalendarDate(year, month, day);
                const key = getDateKey(date);
                const isToday = key === todayKey;
                const dayBirthdays = birthdays.get(day) ?? [];
                const holiday = getHoliday(month, day);
                const label = [
                  fullDate.format(date),
                  isToday && translate("calendar.today"),
                  key === selectedKey && translate("calendar.selected"),
                  holiday && translate(`calendar.holiday.${holiday}`),
                  dayBirthdays.length > 0 &&
                    translate("calendar.birthday", {
                      count: dayBirthdays.length,
                    }),
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li
                    className={`calendar-trail__stop${isToday ? " calendar-trail__stop--today" : ""}${holiday ? " calendar-trail__stop--holiday" : ""}`}
                    style={{
                      left: `${(x / layout.width) * 100}%`,
                      top: `${(y / layout.height) * 100}%`,
                    }}
                    key={day}
                  >
                    {isToday && (
                      <span
                        className="calendar-trail__mascot"
                        aria-hidden="true"
                      >
                        <img alt="" src="/assets/mascots/ladybug.png" />
                        <span>{translate("calendar.today")}</span>
                      </span>
                    )}
                    <Link
                      to={`${TODAY_PATH}?date=${key}`}
                      className="calendar-trail__day"
                      data-date={key}
                      aria-label={label}
                      aria-current={isToday ? "date" : undefined}
                      data-selected={key === selectedKey}
                    >
                      <CalendarArt
                        index={holiday === "valentine" ? 13 : theme.atlasIndex}
                        className="calendar-trail__day-art"
                      />
                      {(holiday === "halloween" || holiday === "christmas") && (
                        <CalendarArt
                          index={holiday === "halloween" ? 14 : 15}
                          className="calendar-trail__holiday-art"
                        />
                      )}
                      <span className="calendar-trail__number">{day}</span>
                      {dayBirthdays.length > 0 && (
                        <span
                          className="calendar-trail__birthday"
                          aria-hidden="true"
                        >
                          <CalendarArt index={12} />
                          <span
                            className={
                              dayBirthdays.length === 1
                                ? "calendar-trail__birthday-label"
                                : undefined
                            }
                          >
                            {dayBirthdays.length > 1
                              ? `×${dayBirthdays.length}`
                              : translate("calendar.birthdayLabel")}
                          </span>
                        </span>
                      )}
                      <span
                        className={`calendar-trail__weekday${holiday ? " calendar-trail__weekday--holiday" : ""}`}
                        aria-hidden="true"
                        title={
                          holiday
                            ? translate(`calendar.holiday.${holiday}`)
                            : undefined
                        }
                      >
                        <abbr title={fullWeekday.format(date)}>
                          {shortWeekday.format(date)}
                        </abbr>
                        {holiday && (
                          <> · {translate(`calendar.holiday.${holiday}`)}</>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="calendar-page__legend" aria-hidden="true">
            <span>
              <CalendarArt index={12} />
              {translate("calendar.birthdayLabel")}
            </span>
            <span className="calendar-page__choose-day">
              <TitleArt monthIndex={month} />
              {translate("calendar.chooseDay")}
            </span>
          </div>
          {(isLoading || error) && (
            <div
              className="calendar-page__data-status"
              role={error ? "alert" : "status"}
            >
              <span>
                {translate(
                  error
                    ? "calendar.birthdaysError"
                    : "calendar.birthdaysLoading",
                )}
              </span>
              {error && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => void reload()}
                >
                  {translate("calendar.retry")}
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
      {pickerOpen && (
        <MonthPicker
          date={displayedMonth}
          onSelect={(date) => {
            changeMonth(date);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </main>
  );
};

export default Calendar;
