import { DotsVerticalIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";

interface Header<T = any> {
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

const HeaderColumn = ({
  isLastItem,
  isFirstItem,
  stickyColumn,
  width,
  label,
  onResizeStart,
}: {
  isLastItem: boolean;
  isFirstItem: boolean;
  stickyColumn?: boolean;
  width: number;
  label: string;
  onResizeStart: () => void;
}) => {
  return (
    <div
      className={classNames("flex", "relative", "border-b border-gray-200", {
        "sticky left-0 z-10 bg-gray-50": stickyColumn && isFirstItem,
        "flex-1": isLastItem,
      })}
      style={{
        width: !isLastItem ? width : undefined,
        boxShadow: "inset 0 -2px 0 rgb(229 231 235)",
      }}
    >
      <div
        className={classNames(
          "w-full",
          "whitespace-nowrap",
          "shrink-0",
          "text-ellipsis",
          "overflow-hidden",
          "px-6 py-3 text-left text-xs font-medium",
          "text-gray-500 uppercase tracking-wider",
          "bg-gray-50"
        )}
      >
        {label}
      </div>
      {!isLastItem && (
        <DotsVerticalIcon
          onMouseDown={onResizeStart}
          className={classNames(
            "w-4 absolute top-0",
            "-right-2 h-full text-gray-300 cursor-col-resize",
            "z-20"
          )}
        />
      )}
    </div>
  );
};

const TableHeader = <T extends {}>({
  headers,
  columnsWidth,
  stickyColumn,
  onColumnsWidthChange,
}: {
  headers: Header<T>[];
  columnsWidth: number[];
  stickyColumn?: boolean;
  onColumnsWidthChange: (columnsWidth: number[]) => void;
}) => {
  const cols = useRef(columnsWidth);
  cols.current = columnsWidth;
  const handleMouseDown = useCallback(
    (columnIndex: number) => {
      const onMouseMove = (ev: MouseEvent) => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const columns = [...cols.current];
        columns[columnIndex] += ev.movementX;
        onColumnsWidthChange(columns);
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
    },
    [onColumnsWidthChange]
  );
  return (
    <div className="bg-gray-50 sticky top-0 z-10">
      <div className="flex flex-row">
        {headers.map(({ label }, i) => (
          <HeaderColumn
            key={label}
            isLastItem={i === headers.length - 1}
            isFirstItem={i === 0}
            stickyColumn={stickyColumn}
            width={columnsWidth[i]}
            label={label}
            onResizeStart={() => handleMouseDown(i)}
          />
        ))}
      </div>
    </div>
  );
};

const Cell = <T extends {}>({
  row,
  width,
  isFirstItem,
  RowCell,
}: {
  width: number | undefined;
  isFirstItem: boolean;
  RowCell: (row: T) => JSX.Element;
  row: T;
}) => {
  return (
    <div
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        boxShadow: isFirstItem ? "inset -1px 0 0 rgb(229 231 235)" : undefined,
      }}
      className={classNames(
        "p-0",
        "shrink-0",
        "overflow-hidden",
        "flex",
        "flex-1",
        {
          "sticky left-0 z20 bg-white group-hover:bg-gray-100": isFirstItem,
        }
      )}
    >
      <RowCell {...row} />
    </div>
  );
};

const Row = <T extends {}>({
  row,
  selectedRowId,
  onRowClick,
  headers,
  columnsWidth,
  RowAction,
  rowId,
}: {
  row: T;
  rowId: string;
  selectedRowId?: string;
  onRowClick?: (row: T) => void;
  headers: Header[];
  columnsWidth: number[];
  RowAction?: (row: T) => JSX.Element;
}) => {
  const selected = selectedRowId === rowId;
  return (
    <div
      key={rowId}
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
        const isLastItem = i === headers.length - 1;
        const isFirstItem = i === 0;
        const width = !isLastItem ? columnsWidth[i] : undefined;
        return (
          <Cell
            width={width}
            isFirstItem={isFirstItem}
            RowCell={RowCell}
            row={row}
          />
        );
      })}
      {RowAction && (
        <div className="group-hover:sticky right-0 z20 flex flex-1">
          <RowAction {...row} />
        </div>
      )}
    </div>
  );
};

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
            <TableHeader
              columnsWidth={columnsWidth}
              headers={headers}
              stickyColumn={stickyColumn}
              onColumnsWidthChange={setColumnsWidth}
            />
          )}
          <div className="divide-y divide-black/10 w-auto">
            {data.map((row) => {
              const id = getRowId(row);
              return (
                <Row
                  key={id}
                  rowId={id}
                  row={row}
                  selectedRowId={selectedRowId}
                  headers={headers}
                  columnsWidth={columnsWidth}
                  RowAction={RowAction}
                  onRowClick={onRowClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
