import type { ComponentPropsWithRef } from "react";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  fullWidth?: boolean;
  shape?: "pill" | "circle";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}
