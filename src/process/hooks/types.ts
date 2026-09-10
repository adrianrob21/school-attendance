import type { zodResolver } from "@hookform/resolvers/zod";
import type { DefaultValues, FieldValues } from "react-hook-form";

export interface UseValidatedFormProps<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  onPersist?: (values: T) => void;
  schema: Parameters<typeof zodResolver>[0];
  skipFields?: string[];
}
