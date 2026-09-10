import type { Control, FieldValues, Path } from "react-hook-form";

export interface InputProps<T extends FieldValues> {
  control: Control<T>;
  label?: string;
  name: Path<T>;
  placeholder: string;
  translateError?: (key: string) => string;
  type?: string;
}
