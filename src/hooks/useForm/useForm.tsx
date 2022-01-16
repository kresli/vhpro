import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const { fromEntries, keys } = Object;

type Validator<O, FV> = (value: O, form: FV) => string | boolean | undefined;

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

function usePrevMemo<T>(
  factory: (prev: T | undefined) => T,
  deps: DependencyList | undefined
): T {
  const ref = useRef<T>();
  const val = factory(ref.current);
  useEffect(() => {
    ref.current = val;
  });
  return val;
}

export function useForm<S extends FormSchema, C extends FormConfig<S>>(
  schema: S,
  formConfig: C
) {
  const schemaRef = useRef(schema);
  const defaultValues = usePrevMemo<ExtractValues<S>>(
    (prev) => {
      const values = fromEntries(
        keys(schemaRef.current).map((key) => [
          key,
          formConfig[key].defaultValue,
        ])
      ) as ExtractValues<S>;
      return prev && JSON.stringify(values) === JSON.stringify(prev)
        ? prev
        : values;
    },
    [formConfig]
  );
  const [overrides, setOverrides] = useState({});
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const values: ExtractValues<S> = useMemo(
    () => ({ ...defaultValues, ...overrides }),
    [defaultValues, overrides]
  );
  const errorMessages = useMemo(
    () =>
      fromEntries(
        keys(schema).map((key) => [
          key,
          findFirstError(values[key], values, formConfig[key].validators),
        ])
      ),
    [formConfig, schema, values]
  );
  const hasError = useMemo(
    () => Object.values(errorMessages).some((msg) => !!msg),
    [errorMessages]
  );
  const fields = usePrevMemo<Fields<S, C>>(
    (prevFields) =>
      fromEntries(
        keys(schemaRef.current).map((key) => {
          const config = formConfig[key];
          const value = values[key];
          const errorMessage = errorMessages[key];
          const prevField = prevFields?.[key];
          if (
            prevField &&
            JSON.stringify([
              prevField.config,
              prevField.value,
              prevFields.errorMessage,
            ]) === JSON.stringify([config, value, errorMessage])
          )
            return [key, prevField];
          return [
            key,
            {
              config: formConfig[key],
              value: values[key],
              errorMessage: errorMessages[key],
              hasError: !!errorMessages[key],
              setValue: (value: any) => {
                const overrides: Record<string, any> = {
                  ...overridesRef.current,
                  [key]: value,
                };
                if (value === config.defaultValue) delete overrides[key];
                setOverrides(overrides);
              },
            },
          ];
        })
      ) as Fields<S, C>,
    [formConfig, errorMessages, values]
  );
  const reset = useCallback(() => {
    setOverrides({});
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = useCallback(
    (callback: (values: ExtractValues<S>) => Promise<void>) => {
      return async () => {
        setIsLoading(true);
        await callback(values);
        setIsLoading(false);
      };
    },
    [values]
  );
  const onPatchSubmit = useCallback(
    (callback: (values: Partial<ExtractValues<S>>) => Promise<void>) => {
      return async () => {
        setIsLoading(true);
        await callback(overrides);
        setIsLoading(false);
      };
    },
    [overrides]
  );
  const isModified = useMemo(() => !!keys(overrides).length, [overrides]);
  const setFormValues = useCallback(
    (values: Partial<ExtractValues<S>>) => {
      setOverrides({ ...overrides, ...values });
    },
    [overrides]
  );
  return {
    fields,
    values,
    hasError,
    reset,
    isModified,
    onSubmit,
    setFormValues,
    isLoading,
    onPatchSubmit,
  };
}
export type UseForm = ReturnType<typeof useForm>;
export function createField<Output, Input = Output>() {
  return null as unknown as { in: Input; out: Output };
}
