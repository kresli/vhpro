import { CheckIcon, SearchIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Page, Table } from "src/components";
import { useApi } from "src/contexts";

const QuestTag: FunctionComponent<{ label: string }> = ({ label }) => {
  return (
    <div
      className={classNames("inline-flex py-1 px-2 text-sm rounded-full", {
        "bg-red-300": label === "EQ5D",
        "bg-cyan-300": label === "FACTG",
        "bg-violet-300": label === "QLQC30",
        "bg-lime-300": label === "BN20",
      })}
    >
      {label}
    </div>
  );
};

const Programs = ({ organisationId }: { organisationId: string }) => {
  const api = useApi();
  const history = useHistory();
  const { data: programs } = useQuery(
    ["programs", organisationId],
    async () => (await api.getPrograms({ organisationId })).data
  );
  if (!programs) return <div>loading</div>;
  return (
    <Card>
      <Table
        onRowClick={({ projectId }) => history.push(`/programs/${projectId}`)}
        stickyColumn
        headers={[
          {
            label: "Project name",
            RowCell: ({ name, imageThumbnailUrl }) => (
              <div className="flex space-x-4 items-center px-6 py-4 whitespace-nowrap">
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
              <div className="flex space-x-1 px-6 py-4 whitespace-nowrap">
                {availableQuestionnaireTypes.map((label) => (
                  <QuestTag label={label} />
                ))}
              </div>
            ),
          },
          {
            label: "consented patients",
            RowCell: ({ consentedPatientsCount }) => (
              <div className="px-6 py-4 whitespace-nowrap">
                {consentedPatientsCount}
              </div>
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
            label: "updated",
            RowCell: ({ dateUpdated }) => (
              <div className="px-6 py-4 whitespace-nowrap">
                {dateUpdated.toLocaleDateString()}
              </div>
            ),
          },
          {
            label: "end date",
            RowCell: ({ endDate }) => (
              <div className="px-6 py-4 whitespace-nowrap">
                {endDate?.toLocaleDateString()}
              </div>
            ),
          },
          {
            label: "free text",
            RowCell: ({ disableFreeText }) => (
              <div className="px-6 py-4 whitespace-nowrap">
                {disableFreeText && (
                  <CheckIcon className="w-6 text-green-500" />
                )}
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
        data={programs}
        getRowId={({ projectId }) => projectId}
      />
    </Card>
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
      <div className="flex flex-1 h-full overflow-hidden px-4 pt-4 flex-col">
        <div className="mb-4 flex flex-row space-x-4 rounded-t-lg">
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
            <Button label="ADD PROGRAM" intent="primary" onClick={() => {}} />
          </div>
        </div>
        <Programs organisationId={organisationId} />
      </div>
    </Page>
  );
};
