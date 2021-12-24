import { FormField } from "src/hooks";

interface FieldProps {
  field: FormField<{ defaultValue: string; label: string; type: string }>;
}

export const FieldText = ({ field }: FieldProps) => {
  const { setValue, value, config } = field;
  const { label, type } = config;
  return (
    <div className="flex flex-col flex-1 w-full">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={({ currentTarget }) => setValue(currentTarget.value)}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
  );
};
