import { SearchIcon } from "@heroicons/react/solid";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Button, Page, TableCard, TableHeader } from "src/components";
import { useApi } from "src/contexts";
import { Organisation } from "src/types";

// function useTableState<T>({
//   page = 1,
//   rowsPerPage,
//   onPageRequest,
// }: {
//   page?: number;
//   rowsPerPage: number;
//   onPageRequest: (payload: {
//     page: number;
//     rowsPerPage: number;
//   }) => Promise<{ totalRows: number; rows: T[] }>;
// }) {
//   const [state, setState] = useState({
//     page,
//     rowsPerPage,
//     rows: [] as T[],
//     totalRows: 0,
//   });

//   const onPageChange = useCallback(
//     async (page: number) => {
//       setState({ ...state, page });
//       const newState = await onPageRequest({
//         page,
//         rowsPerPage: state.rowsPerPage,
//       });
//       setState({ ...state, ...newState });
//     },
//     [onPageRequest, state]
//   );

//   const onRowsPerPageChange = useCallback(
//     async (rowsPerPage: number) => {
//       setState({ ...state, page });
//       const newState = await onPageRequest({ page: state.page, rowsPerPage });
//       setState({ ...state, ...newState });
//     },
//     [onPageRequest, page, state]
//   );

//   return {
//     ...state,
//     onPageChange,
//     onRowsPerPageChange,
//   };
// }

export const OrganisationsPage = () => {
  const api = useApi();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { data } = useQuery([page, rowsPerPage], () =>
    api.getOrganisations({ page, perPage: rowsPerPage })
  );
  const { organisations, totalCount } = data || {
    organisations: [],
    totalCount: 0,
  };
  const headers: TableHeader<Organisation>[] = useMemo(
    () => [
      {
        label: "Organisation name",
        stickyColumn: true,
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
          <div className="px-6 py-4 whitespace-nowrap">{projectsCount}</div>
        ),
      },
      {
        label: "users",
        RowCell: ({ usersCount }) => (
          <div className="px-6 py-4 whitespace-nowrap">{usersCount}</div>
        ),
      },
    ],
    []
  );
  const handleRowClick = useCallback(
    ({ organisationId }) => history.push(`/organisations/${organisationId}`),
    [history]
  );
  const getRowId = ({ organisationId }: Organisation) => organisationId;
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
        <TableCard
          page={page}
          data={organisations}
          rowsPerPage={rowsPerPage}
          totalRows={totalCount}
          headers={headers}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={handleRowClick}
          getRowId={getRowId}
        />
      </div>
    </Page>
  );
};
