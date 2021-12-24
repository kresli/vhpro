interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  label,
  onClick,
  disabled = false,
  loading = false,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        "disabled:bg-indigo-300 group relative w-full flex justify-center " +
        "py-2 px-4 border border-transparent text-sm font-medium rounded-md " +
        "text-white bg-indigo-600 hover:bg-indigo-700 " +
        "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
        "focus:ring-indigo-500 w-full"
      }
    >
      {loading && (
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <div className="border-2 border-transparent  border-t-white rounded-full w-4 h-4 animate-spin" />
        </span>
      )}
      {label}
    </button>
  );
};
