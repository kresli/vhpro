import { SearchIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, Page, Table } from "src/components";
import { useApi } from "src/contexts";
import { Organisation } from "src/types";

export const OrganisationsPage = () => {
  const api = useApi();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const history = useHistory();
  useEffect(() => {
    const run = async () => {
      const d = await api.getOrganisations({});
      console.log(d);
      setOrganisations(d.data);
    };
    run();
  }, [api]);
  return (
    <Page navigation title="Organisations">
      <div className="flex flex-1 h-full overflow-hidden px-4 pt-4">
        <Card>
          <div className="p-4 flex flex-row space-x-4 bg-gray-50 rounded-t-lg">
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
          <Table
            onRowClick={({ organisationId }) =>
              history.push(`/organisations/${organisationId}`)
            }
            headers={[
              {
                label: "Organisation name",
                RowCell: ({ name }) => <div>{name}</div>,
              },
              {
                label: "created",
                RowCell: ({ dateCreated }) => (
                  <div>{dateCreated.toLocaleDateString()}</div>
                ),
              },
              {
                label: "projects",
                RowCell: ({ projectsCount }) => <div>{projectsCount}</div>,
              },
              {
                label: "users",
                RowCell: ({ usersCount }) => <div>{usersCount}</div>,
              },
            ]}
            data={organisations}
            getRowId={({ organisationId }) => organisationId}
          />
        </Card>
      </div>
    </Page>
  );
};
