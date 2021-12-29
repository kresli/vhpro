import classNames from "classnames";
import { useState } from "react";

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
  stickyColumn?: boolean;
  onPageRequest?: (nextPageRequested: boolean) => void;
}

export const Table = <T extends {}>({
  headers,
  data,
  getRowId,
  selectedRowId,
  onRowClick,
  showHeader = true,
  RowAction,
  stickyColumn,
  onPageRequest,
}: Props<T>) => {
  const [columnsWidth, setColumnsWidth] = useState(() =>
    Array.from({ length: headers.length }).map(() => 200)
  );
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="shadow border-b border-gray-200 overflow-scroll flex flex-1">
        <div className="h-fit relative border-b border-black/10 flex-1">
          {showHeader && (
            <div className="bg-gray-50 sticky top-0 z-30">
              <div className="flex flex-row">
                {headers.map(({ label }, i) => (
                  <div
                    key={label}
                    style={{
                      width:
                        i !== headers.length - 1 ? columnsWidth[i] : undefined,
                      boxShadow: "inset 0 -1px 0 rgb(229 231 235)",
                    }}
                    className={classNames(
                      "whitespace-nowrap",
                      "shrink-0",
                      "px-6 py-3 text-left text-xs font-medium",
                      "text-gray-500 uppercase tracking-wider",
                      {
                        "sticky left-0 z20 bg-gray-50": stickyColumn && i === 0,
                        "flex-1": i === headers.length - 1,
                      }
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="divide-y divide-black/10 w-auto">
            {data.map((row) => {
              const key = getRowId(row);
              const selected = selectedRowId === key;
              return (
                <div
                  key={key}
                  className={classNames(
                    "flex",
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
                  {headers.map((header, i) => {
                    const { RowCell } = header;
                    return (
                      <div
                        key={header.label}
                        style={{
                          width:
                            i !== headers.length - 1
                              ? columnsWidth[i]
                              : undefined,
                          boxShadow:
                            stickyColumn && i === 0
                              ? "inset -1px 0 0 rgb(229 231 235)"
                              : undefined,
                        }}
                        className={classNames("p-0", "shrink-0", {
                          "sticky left-0 z20 bg-white group-hover:bg-gray-100":
                            stickyColumn && i === 0,
                        })}
                      >
                        <RowCell {...row} />
                      </div>
                    );
                  })}
                  {false && RowAction && (
                    <div
                      key="actions"
                      className="group-hover:sticky right-0 z20"
                    >
                      <RowAction {...row} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
