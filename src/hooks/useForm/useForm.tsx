import { useMemo, useRef, useState } from "react";

const { fromEntries, entries } = Object;

type FieldConfig<O = any, I = any, FV = any> = {
  defaultValue: O;
  validators?: ((value: O, form: FV) => string | false | undefined)[];
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

export function useForm<S extends FormSchema, C extends FormConfig<S>>(
  schema: S,
  config: C
) {
  const [fields, setFields] = useState<Fields<S, C>>(() => {
    const generatedFields = fromEntries(
      entries(schema).map(([key, schema]) => [
        key,
        {
          value: config[key].defaultValue,
          schema,
          config: config[key],
          reset: () => {
            setFields({
              ...fieldsRef.current,
              [key]: config[key].defaultValue,
            });
          },
          setValue: (value: any) => {
            const updatedFields: Fields<S, C> = {
              ...fromEntries(
                entries(fieldsRef.current).map(([fieldKey, field]) => {
                  const fieldValue = fieldKey === key ? value : field.value;
                  const values = {
                    ...valuesRef.current,
                    [fieldKey]: fieldValue,
                  } as ExtractValues<S>;
                  valuesRef.current = values;
                  const errorMessage = config[fieldKey].validators
                    ?.map((validator) => validator(fieldValue, values))
                    .filter((m) => !!m)[0];
                  const hasError = !!errorMessage;
                  return [
                    fieldKey,
                    {
                      ...field,
                      value: fieldValue,
                      errorMessage,
                      hasError,
                    },
                  ];
                })
              ),
            } as Fields<S, C>;
            setFields(updatedFields);
          },
        },
      ])
    ) as Fields<S, C>;
    // get values for first init
    const values = fromEntries(
      entries(generatedFields).map(([key, field]) => {
        return [key, field.value];
      })
    );
    // get errors for first init
    entries(generatedFields).forEach(([key, field]) => {
      const errorMessage = field.config.validators
        ?.map((validator: any) => validator(field.value, values))
        .filter((m: any) => !!m)[0];
      const hasError = !!errorMessage;
      Object.assign(field, {
        errorMessage,
        hasError,
      });
    });
    return generatedFields;
  });
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;
  const hasError = useMemo(
    () => entries(fields).some(([_, field]) => field.hasError),
    [fields]
  );
  const values = useMemo(
    () =>
      fromEntries(
        entries(fields).map(([key, field]) => {
          return [key, field.value];
        })
      ),
    [fields]
  );
  const valuesRef = useRef(values);
  valuesRef.current = values;
  return { fields, hasError, values };
}

export function createField<Output, Input = Output>() {
  return null as unknown as { in: Input; out: Output };
}
