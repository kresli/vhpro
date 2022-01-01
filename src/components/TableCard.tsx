import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useCallback, useMemo } from "react";
import { TableHeader, Card, Table, InputSelect } from ".";

const PagButton = ({
  label,
  active,
  onClick,
}: {
  label: string | number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={classNames(
      "z-10",
      "relative inline-flex items-center",
      "px-4 py-2 border text-sm font-medium",
      {
        "bg-primary-300": active,
      }
    )}
  >
    {label}
  </button>
);

const Paginator = ({
  pagesCount,
  currentPage,
  onPageChange,
}: {
  pagesCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  // This component implements pagination buttons such as these:
  // ┌───┬───┬───┬───┬───┐
  // │ < │ 1 │ 2 │ 3 │ > │
  // └───┴───┴───┴───┴───┘
  // ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
  // │ < │ 1 │ 2 │ 3 │ 4 │...│ 9 │10 │ > │
  // └───┴───┴───┴───┴───┴───┴───┴───┴───┘
  // ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
  // │ < │ 1 │...│ 4 │ 5 │ 6 │...│10 │ > │
  // └───┴───┴───┴───┴───┴───┴───┴───┴───┘
  const maxButtonsCount = 7;

  const buttons = useMemo(() => {
    if (pagesCount <= maxButtonsCount)
      return Array.from({ length: pagesCount }).map((_, i) => (
        <PagButton
          key={i}
          label={i + 1}
          active={currentPage === i + 1}
          onClick={() => onPageChange(i + 1)}
        />
      ));
    const startAbs = currentPage - Math.floor(maxButtonsCount / 2);
    const start =
      startAbs <= 1
        ? 1
        : startAbs + 7 >= pagesCount
        ? pagesCount - maxButtonsCount + 1
        : startAbs;
    const arr: (string | number)[] = Array.from({
      length: maxButtonsCount,
    }).map((_, i) => i + start);
    arr[0] = 1;
    arr[1] = arr[1] !== 2 ? "..." : arr[1];
    arr[arr.length - 1] = pagesCount;
    arr[arr.length - 2] =
      arr[arr.length - 2] !== pagesCount - 1 ? "..." : arr[arr.length - 2];
    return arr.map((v, i) => (
      <PagButton
        key={`${v}_${i}`}
        label={v}
        active={v === currentPage}
        onClick={() => {
          if (typeof v === "number") onPageChange(v);
        }}
      />
    ));
  }, [currentPage, onPageChange, pagesCount]);
  return (
    <div>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {buttons}
        <button
          disabled={currentPage === pagesCount}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

export const TableCard = <T extends {}>({
  headers,
  data,
  selectedRowId,
  page,
  rowsPerPage,
  totalRows,
  getRowId,
  onRowClick,
  RowAction,
  onPageChange,
  onRowsPerPageChange,
}: {
  headers: TableHeader<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
  RowAction?: (row: T) => JSX.Element;
  page: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  totalRows: number;
  onRowsPerPageChange: (value: number) => void;
}) => {
  const pagesCount = Math.ceil(totalRows / rowsPerPage);
  const handlePerPageCountChange = useCallback(
    (value: number) => {
      onPageChange(1);
      onRowsPerPageChange(value);
    },
    [onPageChange, onRowsPerPageChange]
  );
  return (
    <Card>
      <Table
        onRowClick={onRowClick}
        headers={headers}
        data={data}
        getRowId={getRowId}
        selectedRowId={selectedRowId}
        RowAction={RowAction}
      />
      <Card.Footer>
        <div className="flex-1 flex items-center justify-between py-2 px-4">
          <div className="flex flex-1">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * rowsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * rowsPerPage, totalRows)}
              </span>{" "}
              of <span className="font-medium">{totalRows}</span> results
            </p>
          </div>
          <div className="space-x-4 flex">
            <InputSelect
              items={[
                { id: "5", label: "5 rows", value: 5 },
                { id: "10", label: "10 rows", value: 10 },
                { id: "25", label: "25 rows", value: 25 },
                { id: "50", label: "50 rows", value: 50 },
                { id: "100", label: "100 rows", value: 100 },
              ]}
              selected={`${rowsPerPage}`}
              onChange={({ value }) => handlePerPageCountChange(value)}
            />
            <Paginator
              pagesCount={pagesCount}
              currentPage={page}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};
