import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Card } from "Components";

import "./ComponentPreview.css";

const ComponentPreview = () => {
  const { t: translate } = useTranslation("general");
  const [feedback, setFeedback] = useState("ready");
  const [interactionCount, setInteractionCount] = useState(0);

  const showFeedback = (action: string) => {
    setFeedback(action);
    setInteractionCount((count) => count + 1);
  };

  return (
    <main className="component-preview meadow-background">
      <header className="component-preview__header">
        <p className="component-preview__eyebrow">
          <span aria-hidden="true" className="component-preview__brand-dot" />
          {translate("componentPreview.eyebrow")}
        </p>
        <h1>{translate("componentPreview.title")}</h1>
        <p className="component-preview__intro">
          {translate("componentPreview.intro")}
        </p>
      </header>

      <div className="component-preview__gallery">
        <section
          aria-labelledby="card-preview-title"
          className="component-preview__card-section"
        >
          <h2
            className="component-preview__section-label"
            id="card-preview-title"
          >
            <span aria-hidden="true">01</span>
            {translate("componentPreview.cardLabel")}
          </h2>
          <Card
            className="component-preview__group-card"
            footer={
              <Button onClick={() => showFeedback("group")} size="lg">
                {translate("componentPreview.enterGroup")}
              </Button>
            }
            illustration={
              <img
                alt=""
                className="component-preview__mascot"
                height={1024}
                src="/assets/mascots/ladybug.png"
                width={1024}
              />
            }
            selected={feedback === "group"}
            title={translate("componentPreview.ladybugs")}
            tone="rose"
          />
          <p className="component-preview__card-caption">
            {translate("componentPreview.cardCaption")}
          </p>
        </section>

        <section
          aria-labelledby="button-preview-title"
          className="component-preview__button-section"
        >
          <h2
            className="component-preview__section-label"
            id="button-preview-title"
          >
            <span aria-hidden="true">02</span>
            {translate("componentPreview.buttonLabel")}
          </h2>
          <div className="component-preview__button-panel">
            <h3>{translate("componentPreview.buttonHeading")}</h3>
            <p className="component-preview__panel-intro">
              {translate("componentPreview.buttonIntro")}
            </p>

            <div className="component-preview__specimen">
              <span className="component-preview__specimen-label">
                {translate("componentPreview.primary")}
              </span>
              <Button fullWidth onClick={() => showFeedback("primary")}>
                {translate("componentPreview.continue")}
                <span aria-hidden="true">→</span>
              </Button>
            </div>

            <div className="component-preview__specimen">
              <span className="component-preview__specimen-label">
                {translate("componentPreview.secondary")}
              </span>
              <Button
                aria-label={translate("componentPreview.goBack")}
                onClick={() => showFeedback("secondary")}
                shape="circle"
                variant="secondary"
              >
                <span aria-hidden="true">←</span>
              </Button>
            </div>

            <div className="component-preview__specimen">
              <span className="component-preview__specimen-label">
                {translate("componentPreview.disabled")}
              </span>
              <Button disabled fullWidth>
                {translate("componentPreview.continue")}
              </Button>
            </div>

            <div className="component-preview__navigation-specimen">
              <span className="component-preview__specimen-label">
                {translate("componentPreview.navigation")}
              </span>
              <div className="component-preview__arrow-buttons">
                <Button
                  aria-label={translate("componentPreview.previous")}
                  onClick={() => showFeedback("previous")}
                  shape="circle"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="22"
                    viewBox="0 0 24 24"
                    width="22"
                  >
                    <path
                      d="m14.5 5-7 7 7 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                </Button>
                <Button
                  aria-label={translate("componentPreview.next")}
                  onClick={() => showFeedback("next")}
                  shape="circle"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="22"
                    viewBox="0 0 24 24"
                    width="22"
                  >
                    <path
                      d="m9.5 5 7 7-7 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="component-preview__feedback">
        <span aria-hidden="true" className="component-preview__feedback-dot" />
        <p aria-atomic="true" role="status">
          {translate(`componentPreview.feedback.${feedback}`, {
            count: interactionCount,
          })}
        </p>
      </div>
      <p className="component-preview__footer">
        {translate("componentPreview.footer")}
      </p>
    </main>
  );
};

export default ComponentPreview;
