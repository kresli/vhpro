import { useQuery } from "react-query";
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import {
  Button,
  Highlight,
  ProgramPage,
  TableCard,
  TableHeaderProps,
} from "src/components";
import { useApi } from "src/contexts";
import classNames from "classnames";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  DotsVerticalIcon,
  PaperAirplaneIcon,
  SearchIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { useCallback, useMemo, useState } from "react";
import { Patient } from "src/types";

enum STATUSES {
  CONSENT_GIVEN = "Consented",
  AWAITING_CONSENT = "Invite sent",
}

const RowAction = ({ consentGiven }: Patient) => (
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
          className={classNames(
            "bg-gray-100 p-2 hover:bg-gray-200",
            "rounded-l-md flex items-center"
          )}
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
);

export const EntrolmentPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [term, setTerm] = useState("");
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data } = useQuery(
    [programId, "patients", page, rowsPerPage, term],
    () =>
      api.getPatients({
        programId,
        perPage: rowsPerPage,
        page,
        term,
      }),
    { keepPreviousData: true }
  );
  const { patients, totalCount } = data || { patients: [], totalCount: 0 };
  const headers: TableHeaderProps<Patient>[] = useMemo(
    () => [
      {
        label: "Patient Name",
        stickyColumn: true,
        RowCell: ({ firstName, lastName }) => (
          <div
            className={classNames(
              "px-6 py-4 whitespace-nowrap",
              "text-ellipsis overflow-hidden"
            )}
          >
            <Highlight text={`${firstName} ${lastName}`} term={term} />
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
          <div
            className={classNames(
              "text-gray-500 px-6 py-4",
              "whitespace-nowrap overflow-hidden text-ellipsis"
            )}
          >
            <Highlight text={email} term={term} />
          </div>
        ),
      },
    ],
    [term]
  );
  const onRowClick = useCallback(
    ({ id }) => history.push(`/programs/${programId}/participants/${id}`),
    [history, programId]
  );

  const getRowId = useCallback(({ id }: Patient) => id, []);

  return (
    <ProgramPage programId={programId} program={program}>
      <div className="flex flex-1 h-full overflow-hidden px-4 pt-4 flex-col">
        <div className="flex flex-row space-x-4 rounded-t-lg mb-4">
          <div className="p-2 text-secondary-900">
            <Link to={`/organisations/${program?.organisation.organisationId}`}>
              <ChevronLeftIcon className="w-6" />
            </Link>
          </div>

          <div className="flex flex-col flex-1 w-full">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-500 w-5" />
              </div>

              <input
                type="text"
                value={term}
                onChange={({ currentTarget }) => setTerm(currentTarget.value)}
                placeholder="Search for patient"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12  border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <Button intent="primary" onClick={() => {}}>
              <UserAddIcon className="w-6 mr-2" />
              INVITE NEW PATIENT
            </Button>
          </div>
        </div>
        <TableCard
          onPageChange={setPage}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalCount}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={onRowClick}
          headers={headers}
          data={patients}
          getRowId={getRowId}
          RowAction={RowAction}
        />
      </div>
    </ProgramPage>
  );
};
