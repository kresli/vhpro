import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Page, Table } from "src/components";
import { useApi } from "src/contexts";
import { Organisation } from "src/types";

export const OrganisationsPage = () => {
  const api = useApi();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
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
        headers={[
          {
            label: "Organisation name",
            RowCell: ({ name, organisationId }) => (
              <Link to={`/organisations/${organisationId}`}>{name}</Link>
            ),
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
