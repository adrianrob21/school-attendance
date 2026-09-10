import { useId } from "react";

import "./Card.css";
import type { CardProps } from "./types";

const Card = ({
  children,
  className,
  footer,
  illustration,
  selected = false,
  title,
  tone = "rose",
  ...props
}: CardProps) => {
  const titleId = useId();
  const classes = ["ui-card", `ui-card--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      aria-labelledby={titleId}
      {...props}
      className={classes}
      data-selected={selected || undefined}
    >
      {illustration != null && (
        <div className="ui-card__illustration">{illustration}</div>
      )}
      <h2 className="ui-card__title" id={titleId}>
        {title}
      </h2>
      {children != null && <div className="ui-card__content">{children}</div>}
      {footer != null && <div className="ui-card__footer">{footer}</div>}
    </article>
  );
};

export default Card;
