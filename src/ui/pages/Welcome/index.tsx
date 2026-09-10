import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "Components";
import { CALENDAR_PATH, STUDENTS_PATH, TODAY_PATH } from "Constants";

import "./Welcome.css";
import AnimatedLadybug from "./AnimatedLadybug";

const Welcome = () => {
  const navigate = useNavigate();
  const { t: translate } = useTranslation("general");

  return (
    <main className="welcome-page meadow-background">
      <section className="welcome-page__intro">
        <p className="welcome-page__chapter">{translate("welcome.chapter")}</p>
        <h1>{translate("welcome.title")}</h1>
        <p>{translate("welcome.subtitle")}</p>
      </section>

      <div aria-hidden="true" className="welcome-page__scene">
        <div className="welcome-page__garden">
          <div className="garden-art garden-art--cloud-one" />
          <div className="garden-art garden-art--cloud-two" />
          <svg
            className="welcome-page__flight-trail"
            fill="none"
            viewBox="0 0 640 490"
          >
            <path
              d="M52 252C5 129 160 42 206 125C250 205 73 204 128 112C189 24 497 64 557 168C607 256 503 302 459 256"
              stroke="currentColor"
              strokeDasharray="2 10"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
          <div className="welcome-page__arrival">
            <AnimatedLadybug />
          </div>
          <p className="welcome-page__speech">
            {translate("welcome.greetings.hello")}
          </p>
        </div>
      </div>

      <div className="welcome-page__actions">
        <Button
          className="welcome-page__action welcome-page__action--today"
          onClick={() => navigate(TODAY_PATH)}
          size="lg"
        >
          {translate("today.takeAttendance")}
        </Button>
        <Button
          className="welcome-page__action welcome-page__action--students"
          onClick={() => navigate(STUDENTS_PATH)}
          size="lg"
          variant="secondary"
        >
          {translate("welcome.manageStudents")}
        </Button>
        <Button
          className="welcome-page__action welcome-page__action--calendar"
          onClick={() => navigate(CALENDAR_PATH)}
          size="lg"
          variant="secondary"
        >
          {translate("welcome.goToCalendar")}
        </Button>
      </div>
    </main>
  );
};

export default Welcome;
