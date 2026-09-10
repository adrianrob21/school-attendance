import type { ReactNode, ComponentPropsWithRef } from "react";

export interface CardProps extends Omit<
  ComponentPropsWithRef<"article">,
  "title"
> {
  footer?: ReactNode;
  illustration?: ReactNode;
  selected?: boolean;
  title: string;
  tone?: "rose" | "honey" | "lavender" | "sage" | "cream";
}
