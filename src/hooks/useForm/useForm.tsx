import { useMemo, useState } from "react";

interface FieldConfig<T = any> {
  label: string;
  defaultValue: T;
}

interface UseFormConfig {
  [key: string]: FieldConfig;
}

type Values<T extends UseFormConfig> = {
  [K in keyof T]: T[K]["defaultValue"];
};

export type FormField<T extends FieldConfig> = {
  config: T;
  value: T["defaultValue"];
  setValue: (value: T["defaultValue"]) => void;
};

type Fields<T extends UseFormConfig> = {
  [K in keyof T]: FormField<T[K]>;
};

const { fromEntries, entries } = Object;

export type UseForm<T extends UseFormConfig> = {
  values: Values<T>;
  fields: Fields<T>;
};

export function useForm<T extends UseFormConfig>(config: T): UseForm<T> {
  const defaultValues: Values<T> = useMemo(
    () =>
      fromEntries(
        entries(config).map(([key, { defaultValue }]) => [key, defaultValue])
      ) as Values<T>,
    [config]
  );
  const [overrideValues, setOverrideValues] = useState<Partial<Values<T>>>({});
  const values: Values<T> = useMemo(
    () =>
      fromEntries(
        entries(defaultValues).map(([key, defaultValues]) => [
          key,
          overrideValues[key] || defaultValues,
        ])
      ) as Values<T>,
    [defaultValues, overrideValues]
  );
  const fields: Fields<T> = useMemo(
    () =>
      fromEntries(
        entries(config).map(([key, fieldConfig]) => [
          key,
          {
            value: values[key],
            setValue: (value: any) =>
              setOverrideValues({ ...values, [key]: value }),
            config: fieldConfig,
          },
        ])
      ) as Fields<T>,
    [config, values]
  );
  return { values, fields };
}
