import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, FieldText, ProgramPage, Table } from "src/components";
import { useApi } from "src/contexts";
import { useForm } from "src/hooks";
import classNames from "classnames";
import {
  DotsVerticalIcon,
  PaperAirplaneIcon,
  SearchIcon,
} from "@heroicons/react/solid";

enum STATUSES {
  CONSENT_GIVEN = "Consented",
  AWAITING_CONSENT = "Invite sent",
}

export const EntrolmentPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const history = useHistory();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  const filter = useForm({
    name: {
      type: "text",
      defaultValue: "",
      placeholder: "search for participant",
    },
  });
  return (
    <ProgramPage
      programId={programId}
      program={program}
      participants={participants || []}
    >
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
                label="INVITE NEW PATIENT"
                intent="primary"
                onClick={() => {}}
              />
            </div>
          </div>
          <Table
            onRowClick={({ id }) =>
              history.push(`/programs/${programId}/participants/${id}`)
            }
            stickyColumn
            headers={[
              {
                label: "Patient Name",
                RowCell: ({ firstName, lastName }) => (
                  <div>
                    {firstName} {lastName}
                  </div>
                ),
              },
              {
                label: "status",
                RowCell: ({ consentStatus }) => (
                  <div
                    className={classNames(
                      "inline-flex rounded-full py-1 px-3 text-sm",
                      {
                        "bg-green-300": consentStatus === "CONSENT_GIVEN",
                        "bg-yellow-300": consentStatus === "AWAITING_CONSENT",
                      }
                    )}
                  >
                    {STATUSES[consentStatus as keyof typeof STATUSES]}
                  </div>
                ),
              },
              {
                label: "email",
                RowCell: ({ email }) => (
                  <div className="text-gray-500">{email}</div>
                ),
              },
            ]}
            data={participants || []}
            getRowId={({ id }) => id}
            RowAction={({ consentGiven }) => (
              <div className="text-sm mr-4 justify-end flex flex-row">
                <div
                  className={classNames(
                    "inline-flex",
                    "whitespace-nowrap",
                    "border rounded-md border-slate-300"
                  )}
                >
                  {!consentGiven && (
                    <button
                      onClick={() => {}}
                      className="bg-gray-100 p-2 hover:bg-gray-200 rounded-l-md flex items-center"
                    >
                      <PaperAirplaneIcon className="w-4 mr-1" />
                      Resend invite
                    </button>
                  )}
                  <button
                    onClick={() => {}}
                    className={classNames("p-2 bg-gray-100 hover:bg-gray-200", {
                      "rounded-r-md": true,
                      "rounded-l-md": consentGiven,
                      "border-l": !consentGiven,
                    })}
                  >
                    <DotsVerticalIcon className="w-6" />
                  </button>
                </div>
              </div>
            )}
          />
        </Card>
      </div>
    </ProgramPage>
  );
};
