import { SearchIcon } from "@heroicons/react/solid";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Button, Page, TableCard, TableHeader } from "src/components";
import { useApi } from "src/contexts";
import { Organisation } from "src/types";

export const OrganisationsPage = () => {
  const api = useApi();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const { data } = useQuery([page, perPage], async () =>
    api.getOrganisations({ page, perPage })
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
          currentPage={page}
          onPageChange={setPage}
          perPageCount={perPage}
          totalDataCount={totalCount}
          onPerPageCountChange={setPerPage}
          onRowClick={handleRowClick}
          headers={headers}
          data={organisations}
          getRowId={getRowId}
        />
      </div>
    </Page>
  );
};
