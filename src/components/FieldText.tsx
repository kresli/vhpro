import { SearchIcon } from "@heroicons/react/solid";
import { HTMLInputTypeAttribute } from "react";

interface FieldProps {
  field: {
    config: {
      label: string;
      type: HTMLInputTypeAttribute;
      placeholder?: string;
    };
    value: string;
    setValue: (value: string) => void;
    label?: string;
  };
}

export const FieldText = ({ field }: FieldProps) => {
  const { setValue, value, config } = field;
  const { label, type, placeholder } = config;
  return (
    <div className="flex flex-col flex-1 w-full">
      {label && (
        <span className="block text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-500 w-5" />
        </div>

        <input
          type={type}
          value={value}
          onChange={({ currentTarget }) => setValue(currentTarget.value)}
          placeholder={placeholder}
          className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12  border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};
