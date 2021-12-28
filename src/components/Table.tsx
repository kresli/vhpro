import classNames from "classnames";

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
  showHeader?: boolean;
  RowAction?: (row: T) => JSX.Element;
}

export const Table = <T extends {}>({
  headers,
  data,
  getRowId,
  selectedRowId,
  onRowClick,
  showHeader = true,
  RowAction,
}: Props<T>) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex overflow-hidden">
        <div className="align-middle overflow-hidden flex flex-1">
          <div className="shadow border-b border-gray-200 overflow-auto flex flex-1">
            <table className="min-w-full divide-y divide-gray-200 h-fit relative">
              {showHeader && (
                <thead className="bg-gray-50 sticky top-0 z-30">
                  <tr
                    style={{
                      boxShadow: "inset 0 -1px 0 rgb(229 231 235)",
                    }}
                  >
                    {headers.map(({ label }) => (
                      <th
                        key={label}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {label}
                      </th>
                    ))}
                    {RowAction && <th className=""></th>}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-black/10">
                {data.map((row) => {
                  const key = getRowId(row);
                  const selected = selectedRowId === key;
                  return (
                    <tr
                      key={key}
                      className={classNames(
                        "group",
                        "cursor-pointer",
                        "hover:bg-black/5",
                        "text-gray-700",
                        {
                          "hover:bg-slate-300": selected,
                          "bg-slate-300": selected,
                          "text-gray-800": selected,
                        }
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
                      {RowAction && (
                        <td
                          key="actions"
                          className="group-hover:sticky right-0 z20"
                        >
                          <RowAction {...row} />
                        </td>
                      )}
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
