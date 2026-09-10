import type { z } from "zod";
import type { Path } from "react-hook-form";

import type { signInSchema } from "ValidationSchemas";

export type SignInValues = z.infer<typeof signInSchema>;

export interface SignInInput {
  key: Path<SignInValues>;
  label: string;
  placeholder: string;
  type?: string;
}
