import classNames from "classnames";
import { FunctionComponent } from "react";

interface Props {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  intent?: "primary" | "none";
}

export const Button: FunctionComponent<Props> = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  intent = "none",
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        "disabled:bg-secondary-300 group relative w-full flex justify-center " +
          "py-2 px-4 border border-transparent text-sm font-medium rounded-md " +
          "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
          "inline-flex items-center px-4 py-2 border",
        "border-transparent rounded-md shadow-sm text-sm",
        "h-full",
        "font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "text-white",
        {
          "text-white bg-primary-600 hover:bg-primary-700":
            intent === "primary",
          "bg-white border border-gray-300 shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-100":
            intent === "none",
        }
      )}
    >
      {loading && (
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <div className="border-2 border-transparent  border-t-white rounded-full w-4 h-4 animate-spin" />
        </span>
      )}
      {label || children}
    </button>
  );
};
