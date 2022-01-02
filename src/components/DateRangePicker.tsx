import { CalendarIcon } from "@heroicons/react/solid";
import classNames from "classnames";
type Range = [Date | undefined, Date | undefined];

interface Props {
  range: Range;
  onChange: (range: Range) => void;
}

export const DateRangePicker = ({ range: [start, end], onChange }: Props) => {
  // console.log(start, start?.toISOString().slice(0, 10));
  return (
    <div className="flex items-center">
      <div className="relative">
        <div
          className={classNames(
            "flex absolute inset-y-0 left-0",
            "items-center pl-3 pointer-events-none"
          )}
        >
          <CalendarIcon className="w-5 text-gray-400" />
        </div>
        <input
          onChange={(e) => onChange([new Date(e.currentTarget.value), end])}
          name="start"
          type="date"
          value={start?.toISOString().slice(0, 10) || ""}
          className={classNames(
            "bg-gray-50 border border-gray-300",
            "text-gray-900 sm:text-sm rounded-l-lg block w-full pl-10 p-2.5"
          )}
          placeholder="Select date start"
        />
      </div>
      <div className="relative">
        <div
          className={classNames(
            "flex absolute inset-y-0 left-0",
            "items-center pl-3 pointer-events-none"
          )}
        >
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5 text-gray-400" />
          </div>
        </div>
        <input
          name="end"
          type="date"
          onChange={(e) => onChange([start, new Date(e.currentTarget.value)])}
          value={end?.toISOString().slice(0, 10) || ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-r-lg block w-full pl-10 p-2.5"
          placeholder="Select date end"
        />
      </div>
    </div>
  );
};
