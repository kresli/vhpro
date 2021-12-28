import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Page, Table } from "src/components";
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
    </Page>
  );
};
