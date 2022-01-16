import { useCallback, useMemo, useRef, useState } from "react";

const { fromEntries, keys } = Object;

type Validator<O, FV> = (value: O, form: FV) => string | false | undefined;

type FieldConfig<O = any, I = any, FV = any> = {
  defaultValue: O;
  validators?: Validator<O, FV>[];
};

type FormSchema = Record<string, ReturnType<typeof createField>>;
type ExtractValues<T extends FormSchema> = { [K in keyof T]: T[K]["out"] };
type FormConfig<T extends FormSchema> = {
  [K in keyof T]: FieldConfig<T[K]["in"], T[K]["out"], ExtractValues<T>>;
};

type Fields<T extends FormSchema, C extends FormConfig<T>> = {
  [K in keyof T]: {
    value: T[K]["out"];
    schema: T[K];
    config: C[K];
    errorMessage: string | undefined;
    hasError: boolean;
    setValue: (value: T[K]["out"]) => void;
    reset: () => void;
  };
};

function findFirstError<V, SV>(
  value: V,
  values: SV,
  validators?: Validator<V, SV>[]
) {
  if (!validators) return;
  for (const validator of validators) {
    const message = validator(value, values);
    if (!!message) return message;
  }
}

export function useForm<S extends FormSchema, C extends FormConfig<S>>(
  schema: S,
  config: C
) {
  const schemaRef = useRef(schema);
  const [defaultValues] = useState(
    () =>
      fromEntries(
        keys(schemaRef.current).map((key) => [key, config[key].defaultValue])
      ) as ExtractValues<S>
  );
  const [overrides, setOverrides] = useState({});
  const values: ExtractValues<S> = useMemo(
    () => ({ ...defaultValues, ...overrides }),
    [defaultValues, overrides]
  );
  const errorMessages = useMemo(
    () =>
      fromEntries(
        keys(schema).map((key) => [
          key,
          findFirstError(values[key], values, config[key].validators),
        ])
      ),
    [config, schema, values]
  );
  const hasError = useMemo(
    () => Object.values(errorMessages).some((msg) => !!msg),
    [errorMessages]
  );
  const fields = useMemo<Fields<S, C>>(
    () =>
      fromEntries(
        keys(schemaRef.current).map((key) => [
          key,
          {
            config: config[key],
            value: values[key],
            errorMessage: errorMessages[key],
            hasError: !!errorMessages[key],
            setValue: (value: any) => {
              setOverrides({ ...overrides, [key]: value });
            },
          },
        ])
      ) as Fields<S, C>,
    [config, errorMessages, overrides, values]
  );
  const reset = useCallback(() => {
    setOverrides({});
  }, []);
  return { fields, values, hasError, reset };
}

export function createField<Output, Input = Output>() {
  return null as unknown as { in: Input; out: Output };
}
