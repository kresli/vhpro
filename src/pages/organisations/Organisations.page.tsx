import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Button, Card, Page, Table, TableHeader } from "src/components";
import { useApi } from "src/contexts";

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
  pagesCount = 100,
  currentPage = 95,
  onPageChange,
}: {
  pagesCount?: number;
  currentPage?: number;
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
          label={i + 1}
          active={currentPage === i}
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
        label={v}
        active={v === currentPage}
        onClick={() => onPageChange(start + i)}
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

const CardTable = <T extends {}>({
  onRowClick,
  headers,
  data,
  getRowId,
  selectedRowId,
  RowAction,
  currentPage,
  onPageChange,
  perPageCount,
  totalDataCount,
}: {
  headers: TableHeader<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
  RowAction?: (row: T) => JSX.Element;
  currentPage: number;
  onPageChange: (page: number) => void;
  perPageCount: number;
  totalDataCount: number;
}) => {
  const pagesCount = Math.ceil(totalDataCount / perPageCount);
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
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * perPageCount + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">{currentPage * perPageCount}</span>{" "}
              of <span className="font-medium">{totalDataCount}</span> results
            </p>
          </div>
          <Paginator
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </Card.Footer>
    </Card>
  );
};

export const OrganisationsPage = () => {
  const api = useApi();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const dataPerPage = 1;
  const { data } = useQuery([page, dataPerPage], async () =>
    api.getOrganisations({ page, perPage: dataPerPage })
  );
  const { organisations, totalCount } = data || {
    organisations: [],
    totalCount: 0,
  };
  return (
    <Page navigation title="Organisations">
      <div className="flex flex-1 h-full overflow-hidden px-4 pt-4 flex-col">
        <div className="mb-4 flex flex-row space-x-4  rounded-t-lg">
          <div className="flex flex-col flex-1 w-full">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-500 w-5" />
              </div>

              <input
                type="text"
                value={""}
                onChange={({ currentTarget }) => {}}
                placeholder=""
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12  border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <Button
              label="ADD ORGANISATION"
              intent="primary"
              onClick={() => {}}
            />
          </div>
        </div>
        <CardTable
          currentPage={page}
          onPageChange={setPage}
          perPageCount={dataPerPage}
          totalDataCount={totalCount}
          onRowClick={({ organisationId }) =>
            history.push(`/organisations/${organisationId}`)
          }
          headers={[
            {
              label: "Organisation name",
              RowCell: ({ name }) => (
                <div className="px-6 py-4 whitespace-nowrap">{name}</div>
              ),
            },
            {
              label: "created",
              RowCell: ({ dateCreated }) => (
                <div className="px-6 py-4 whitespace-nowrap">
                  {dateCreated.toLocaleDateString()}
                </div>
              ),
            },
            {
              label: "projects",
              RowCell: ({ projectsCount }) => (
                <div className="px-6 py-4 whitespace-nowrap">
                  {projectsCount}
                </div>
              ),
            },
            {
              label: "users",
              RowCell: ({ usersCount }) => (
                <div className="px-6 py-4 whitespace-nowrap">{usersCount}</div>
              ),
            },
          ]}
          data={organisations}
          getRowId={({ organisationId }) => organisationId}
        />
      </div>
    </Page>
  );
};
