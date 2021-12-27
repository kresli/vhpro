import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Page, Table } from "src/components";
import { useApi } from "src/contexts";
import { Tab } from "@headlessui/react";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs }: { tabs: { label: string }[] }) {
  return (
    <div className="w-full max-w-md px-2">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          {tabs.map(({ label }) => (
            <Tab
              key={label}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {label}
            </Tab>
          ))}
        </Tab.List>
        {/* <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "bg-white rounded-xl p-3",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
              )}
            >
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative p-3 rounded-md hover:bg-coolGray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>

                    <ul className="flex mt-1 space-x-1 text-xs font-normal leading-4 text-coolGray-500">
                      <li>{post.date}</li>
                      <li>&middot;</li>
                      <li>{post.commentCount} comments</li>
                      <li>&middot;</li>
                      <li>{post.shareCount} shares</li>
                    </ul>

                    <a
                      href="#"
                      className={classNames(
                        "absolute inset-0 rounded-md",
                        "focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels> */}
      </Tab.Group>
    </div>
  );
}

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
    >
      <div className="flex justify-center p-4">
        <Tabs tabs={[{ label: "Programs" }, { label: "Settings" }]} />
      </div>
      <Programs organisationId={organisationId} />
    </Page>
  );
};
