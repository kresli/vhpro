import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import {
  FieldText,
  ParticipantsTable,
  ProgramPage,
  Table,
} from "src/components";
import { useApi } from "src/contexts";
import { useForm } from "src/hooks";
import classNames from "classnames";
const Row: FunctionComponent<{
  padding?: boolean;
}> = ({ children, padding }) => <div className="flex ">{children}</div>;
enum STATUSES {
  CONSENT_GIVEN = "Consented",
  AWAITING_CONSENT = "Invite sent",
}

const Button: FunctionComponent<{ intent?: "primary" | "none" }> = ({
  children,
  intent = "none",
}) => (
  <button
    type="button"
    className={classNames(
      "inline-flex items-center px-4 py-2 border",
      "border-transparent rounded-md shadow-sm text-sm",
      "font-medium",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      {
        "text-white bg-primary-600 hover:bg-primary-700": intent === "primary",
        "bg-white border border-gray-300 shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-100":
          intent === "none",
      }
    )}
  >
    {children}
  </button>
);

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
      <div className="flex flex-1 h-full overflow-hidden p-4 bg-gray-100">
        <div className="rounded-lg bg-white flex flex-1 flex-col shadow border-slate-300 border overflow-hidden">
          <div className="p-4 flex flex-row space-x-4 bg-gray-50 rounded-t-lg">
            <FieldText field={filter.fields.name} />
            <Button intent="primary">Invite new patient</Button>
          </div>
          <Table
            onRowClick={({ id }) =>
              history.push(`/programs/${programId}/participants/${id}`)
            }
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
            RowAction={(row) => (
              <div className="text-sm mr-4">
                <Button>
                  <span className="whitespace-nowrap">Resend invite</span>
                </Button>
              </div>
            )}
          />
        </div>
      </div>
    </ProgramPage>
  );
};
