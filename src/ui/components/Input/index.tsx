import { useController } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import type { InputProps } from "./types";

const Input = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  translateError,
  type = "text",
}: InputProps<T>) => {
  const { field, fieldState } = useController({ control, name });

  const rawError = fieldState.error?.message;
  const error =
    rawError && translateError ? translateError(rawError) : rawError;

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        {...field}
        className="border p-1"
        id={name}
        placeholder={placeholder}
        type={type}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
