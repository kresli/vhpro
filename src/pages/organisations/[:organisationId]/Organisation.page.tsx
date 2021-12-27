import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Page, Table } from "src/components";
import { useApi } from "src/contexts";

const Content = ({ organisationId }: { organisationId: string }) => {
  const api = useApi();
  const { data: programs } = useQuery(
    ["programs", organisationId],
    async () => (await api.getPrograms({ organisationId })).data
  );
  if (!programs) return <div>loading</div>;
  return (
    <Table
      headers={[
        {
          label: "Project name",
          RowCell: ({ name, projectId }) => (
            <Link to={`/programs/${projectId}`}>{name}</Link>
          ),
        },
      ]}
      data={programs}
      getRowId={({ projectId }) => projectId}
    />
  );
};

export const OrganisationPage = () => {
  const api = useApi();
  const { organisationId } = useParams<{ organisationId: string }>();
  const { data: organisation } = useQuery(
    ["organisation", organisationId],
    async () => await (await api.getOrganisation(organisationId)).data
  );

  return (
    <Page
      navigation
      title={organisation?.name}
      loadingContent={!organisation}
      backAction={{ href: "/organisations", label: "Organisations" }}
    >
      <Content organisationId={organisationId} />
    </Page>
  );
};
