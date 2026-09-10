import "./Button.css";
import type { ButtonProps } from "./types";

const Button = ({
  children,
  className,
  disabled = false,
  fullWidth = false,
  shape = "pill",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    `ui-button--${shape}`,
    fullWidth && shape !== "circle" && "ui-button--full-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} className={classes} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
