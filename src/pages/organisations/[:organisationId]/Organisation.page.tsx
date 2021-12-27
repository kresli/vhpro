import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Page, Table, Tabs } from "src/components";
import { useApi } from "src/contexts";
import { Tab } from "@headlessui/react";

const Programs = ({ organisationId }: { organisationId: string }) => {
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
              <Link to={`/programs/${projectId}`}>{name}</Link>
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

export const OrganisationPage = () => {
  const api = useApi();
  const { organisationId } = useParams<{ organisationId: string }>();
  const { data: organisation } = useQuery(
    ["organisation", organisationId],
    async () => (await api.getOrganisation(organisationId)).data
  );

  return (
    <Page
      navigation
      title={`${organisation?.name} organisation`}
      loadingContent={!organisation}
      backAction={{ href: "/organisations", label: "Organisations" }}
      sections={[{ label: "Programs" }, { label: "Settings" }]}
    >
      <Programs organisationId={organisationId} />
    </Page>
  );
};
