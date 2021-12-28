import { useQuery } from "react-query";
import { Link, useHistory, useParams } from "react-router-dom";
import { Page, Table } from "src/components";
import { useApi } from "src/contexts";

const Programs = ({ organisationId }: { organisationId: string }) => {
  const api = useApi();
  const history = useHistory();
  const { data: programs } = useQuery(
    ["programs", organisationId],
    async () => (await api.getPrograms({ organisationId })).data
  );
  if (!programs) return <div>loading</div>;
  return (
    <Table
      onRowClick={({ projectId }) => history.push(`/programs/${projectId}`)}
      headers={[
        {
          label: "Project name",
          RowCell: ({ name, projectId, imageThumbnailUrl }) => (
            <div className="flex space-x-4 items-center">
              <div
                className="w-14 h-14 border bg-slate-50 rounded-md"
                style={{
                  backgroundImage: `url(${imageThumbnailUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <div>{name}</div>
            </div>
          ),
        },
        {
          label: "Questionnaire types",
          RowCell: ({ availableQuestionnaireTypes }) => (
            <div>{availableQuestionnaireTypes.join(", ")}</div>
          ),
        },
        {
          label: "consented patients",
          RowCell: ({ consentedPatientsCount }) => (
            <div>{consentedPatientsCount}</div>
          ),
        },
        {
          label: "created",
          RowCell: ({ dateCreated }) => (
            <div>{dateCreated.toLocaleDateString()}</div>
          ),
        },
        {
          label: "updated",
          RowCell: ({ dateUpdated }) => (
            <div>{dateUpdated.toLocaleDateString()}</div>
          ),
        },
        {
          label: "end date",
          RowCell: ({ endDate }) => <div>{endDate?.toLocaleDateString()}</div>,
        },
        {
          label: "free text",
          RowCell: ({ disableFreeText }) => (
            <div>{disableFreeText ? "NO" : "YES"}</div>
          ),
        },
        {
          label: "users",
          RowCell: ({ usersCount }) => <div>{usersCount}</div>,
        },
      ]}
      data={programs}
      getRowId={({ projectId }) => projectId}
    />
  );
};

export const ProgramsPage = () => {
  const api = useApi();
  const { organisationId } = useParams<{ organisationId: string }>();
  const { data: organisation } = useQuery(
    ["organisation", organisationId],
    async () => (await api.getOrganisation(organisationId)).data
  );

  const baseURL = `/organisations/${organisationId}`;

  return (
    <Page
      navigation
      title={`${organisation?.name} organisation`}
      backAction={{ href: "/organisations", label: "Organisations" }}
      sections={[
        { label: "Programs", link: `${baseURL}/programs` },
        { label: "Settings", link: `${baseURL}/settings` },
      ]}
    >
      <Programs organisationId={organisationId} />
    </Page>
  );
};
