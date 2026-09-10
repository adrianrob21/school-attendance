import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { UseValidatedFormProps } from "./types";

const deleteField = (errors: Record<string, unknown>, field: string) => {
  delete errors[field];
};

const useValidatedForm = <T extends FieldValues>({
  defaultValues,
  onPersist,
  schema,
  skipFields = [],
}: UseValidatedFormProps<T>) => {
  const resolver = useMemo(() => {
    const baseResolver = zodResolver(schema);
    if (skipFields.length === 0) return baseResolver;

    return (async (values, context, options) => {
      const result = await baseResolver(values, context, options);
      if ("errors" in result && result.errors) {
        skipFields.forEach(
          deleteField.bind(null, result.errors as Record<string, unknown>),
        );
      }
      return result;
    }) as typeof baseResolver;
  }, [schema, skipFields]);

  const form = useForm<T>({
    defaultValues,
    mode: "onBlur",
    resolver: resolver as never,
    reValidateMode: "onChange",
  });

  const onPersistRef = useRef(onPersist);
  onPersistRef.current = onPersist;

  useEffect(() => {
    const subscription = form.watch((values) => {
      onPersistRef.current?.(values as T);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return form;
};

export default useValidatedForm;
