import { classNames } from "src/utils";

interface Header<T> {
  label: string;
  RowCell: (row: T) => JSX.Element;
}

interface Props<T extends {}> {
  headers: Header<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
}

export const Table = <T extends {}>({
  headers,
  data,
  getRowId,
  selectedRowId,
  onRowClick,
}: Props<T>) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex overflow-hidden">
        <div className="align-middle overflow-hidden flex flex-1">
          <div className="shadow border-b border-gray-200 overflow-auto flex flex-1">
            <table className="min-w-full divide-y divide-gray-200 h-fit relative">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="">
                  {headers.map(({ label }) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        boxShadow: "inset 0 -1px 0 rgb(229 231 235)",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => {
                  const key = getRowId(row);
                  return (
                    <tr
                      key={key}
                      className={classNames(
                        "cursor-pointer",
                        "hover:bg-slate-100 text-gray-700",
                        selectedRowId === key &&
                          "hover:bg-slate-300 bg-slate-300 text-gray-800"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {headers.map((header) => {
                        const { RowCell } = header;
                        return (
                          <td
                            key={header.label}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <RowCell {...row} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
