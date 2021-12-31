import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, ProgramPage, Table } from "src/components";
import { useApi } from "src/contexts";
import classNames from "classnames";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsVerticalIcon,
  PaperAirplaneIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { useState } from "react";

enum STATUSES {
  CONSENT_GIVEN = "Consented",
  AWAITING_CONSENT = "Invite sent",
}

export const EntrolmentPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const history = useHistory();
  const patientsPerPage = 25;
  const [patientsCurrPage, setPatientsCurrPage] = useState(1);
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () =>
      (
        await api.getPatients({
          programId,
          perPage: patientsPerPage,
          page: patientsCurrPage,
        })
      ).data
  );
  const pageCount = Math.ceil((program?.usersCount || 0) / patientsPerPage);
  return (
    <ProgramPage
      programId={programId}
      program={program}
      participants={participants || []}
    >
      <div className="flex flex-1 h-full overflow-hidden px-4 pt-4 flex-col">
        <div className="flex flex-row space-x-4 rounded-t-lg mb-4">
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
        <Card>
          <Table
            onRowClick={({ id }) =>
              history.push(`/programs/${programId}/participants/${id}`)
            }
            headers={[
              {
                label: "Patient Name",
                stickyColumn: true,
                RowCell: ({ firstName, lastName }) => (
                  <div className="px-6 py-4 whitespace-nowrap text-ellipsis overflow-hidden">
                    {firstName} {lastName}
                  </div>
                ),
              },
              {
                label: "status",
                defaultWidth: 150,
                RowCell: ({ consentStatus }) => (
                  <div className="px-6 py-4 whitespace-nowrap">
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
                  </div>
                ),
              },
              {
                label: "email",
                defaultWidth: 300,
                RowCell: ({ email }) => (
                  <div className="text-gray-500 px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    {email}
                  </div>
                ),
              },
            ]}
            data={participants || []}
            getRowId={({ id }) => id}
            RowAction={({ consentGiven }) => (
              <div className="text-sm mr-4 justify-end flex flex-1 flex-row items-center">
                <div
                  className={classNames(
                    "inline-flex",
                    "whitespace-nowrap",
                    "border rounded-md border-slate-300",
                    "h-fit"
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
          <Card.Footer>
            <div className="flex-1 flex items-center justify-between py-2 px-4">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(patientsCurrPage - 1) * patientsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {patientsCurrPage * patientsPerPage}
                  </span>{" "}
                  of <span className="font-medium">{program?.usersCount}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <button
                      className={classNames(
                        "z-10 bg-indigo-50 border-indigo-500",
                        "text-indigo-600 relative inline-flex items-center",
                        "px-4 py-2 border text-sm font-medium"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </ProgramPage>
  );
};
