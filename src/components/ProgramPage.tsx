import { ExclamationCircleIcon } from "@heroicons/react/outline";
import {
  BeakerIcon,
  ChartPieIcon,
  CogIcon,
  CollectionIcon,
  FlagIcon,
  OfficeBuildingIcon,
  SearchIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import {
  Card,
  Highlight,
  InputSelect,
  Page,
  Paginator,
  TableCard,
} from "src/components";
import { useApi } from "src/contexts";
import { Patient, Program } from "src/types";
import { TableHeader } from "./Table";

interface Props {
  programId: string;
  program?: Program;
  selectedParticipantId?: string;
}

const Footer = ({
  page,
  rowsPerPage,
  totalCount,
  setPage,
  setRowsPerPage,
}: {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}) => {
  const handlePerPageCountChange = useCallback(
    (value: number) => {
      setPage(1);
      setRowsPerPage(value);
    },
    [setPage, setRowsPerPage]
  );
  return (
    <Card.Footer>
      <div className="flex flex-col px-4 py-2 bg-gray-50">
        <span className="text-sm text-gray-700 flex-shrink-0 mb-2">
          Showing{" "}
          <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(page * rowsPerPage, totalCount)}
          </span>{" "}
          of <span className="font-medium">{totalCount}</span> results
        </span>
        <div className="flex flex-row justify-items-stretch">
          <InputSelect
            items={[
              { id: "5", label: "5 rows", value: 5 },
              { id: "10", label: "10 rows", value: 10 },
              { id: "25", label: "25 rows", value: 25 },
              { id: "50", label: "50 rows", value: 50 },
              { id: "100", label: "100 rows", value: 100 },
            ]}
            selected={`${rowsPerPage}`}
            onChange={({ value }) => handlePerPageCountChange(value)}
          />
          <div className="flex flex-1 justify-end">
            <Paginator
              showActivePageOnly
              pagesCount={Math.ceil(totalCount / rowsPerPage)}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </Card.Footer>
  );
};

export const ProgramPage: FunctionComponent<Props> = ({
  programId,
  program,
  children,
  selectedParticipantId,
}) => {
  const baseURL = `/programs/${programId}`;
  const history = useHistory();
  const [filterTerm, setFilterTerm] = useState("");
  const sections = useMemo(
    () => [
      {
        label: "Patient enrolment",
        link: `${baseURL}/enrolment`,
        Icon: FlagIcon,
      },
      { label: "Reports", link: `${baseURL}/reports`, Icon: ChartPieIcon },
      {
        label: "Questionnaires",
        link: `${baseURL}/questionnaires`,
        Icon: BeakerIcon,
      },
      { label: "Team", link: `${baseURL}/team`, Icon: UserGroupIcon },
      { label: "Settings", link: `${baseURL}/settings`, Icon: CogIcon },
    ],
    [baseURL]
  );
  const api = useApi();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { data } = useQuery(
    [programId, "patients", page, rowsPerPage, filterTerm],
    () =>
      api.getPatients({
        programId,
        perPage: rowsPerPage,
        page,
        term: filterTerm,
      }),
    { keepPreviousData: true }
  );
  const { patients, totalCount } = data || { patients: [], totalCount: 0 };
  const onRowClick = useCallback(
    () =>
      ({ id }: Patient) =>
        history.push(`/programs/${programId}/participants/${id}`),
    [history, programId]
  );
  const headers: TableHeader<Patient>[] = useMemo(
    () => [
      {
        label: "Patient Name",
        RowCell: ({ firstName, lastName, severeSymptomsCount, id, email }) => (
          <div className="relative group px-6 py-4 whitespace-nowrap flex-1 flex flex-col">
            {selectedParticipantId === id && (
              <div className="absolute h-full w-1 bg-primary-500 left-0 top-0" />
            )}
            <div>
              <Highlight text={`${firstName} ${lastName}`} term={filterTerm} />
            </div>
            <div className="text-gray-400 text-sm">
              <Highlight text={email} term={filterTerm} />
            </div>
            {!!severeSymptomsCount && (
              <div className="absolute h-full right-0 top-0 flex items-center pr-4">
                <div className="bg-red-400 rounded-full px-2 py-1 text-sm flex items-center h-fit w-fit">
                  <div className="flex whitespace-nowrap space-x-1">
                    <ExclamationCircleIcon className="w-4" />
                    <span>{severeSymptomsCount}</span>
                    <span className="hidden group-hover:block">
                      SEVERE SYMPTOMPS
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
    ],
    [filterTerm, selectedParticipantId]
  );
  const getRowId = useCallback(({ id }) => id, []);
  const breadcrumbs = useMemo(
    () => [
      {
        Icon: CollectionIcon,
        href: `/organisaitons`,
        label: "Organisations",
      },
      {
        Icon: OfficeBuildingIcon,
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name} organisation`,
      },
    ],
    [program?.organisation.name, program?.organisation.organisationId]
  );
  return (
    <Page
      navigation
      title={
        <div className="flex flex-col justify-center items-center">
          {`${program?.name} program`}
          <div className="text-sm text-gray-400">{program?.description}</div>
        </div>
      }
      sections={sections}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-row flex-1 h-full overflow-hidden">
        <div
          className={classNames(
            "flex flex-col w-96 border-r",
            "border-slate-30 shrink-0 border-secondary-200"
          )}
        >
          <div className="flex flex-col overflow-hidden h-full">
            <div
              className={classNames(
                "h-16 justify-center items-center",
                "flex text-secondary-900/40 flex-shrink-0"
              )}
            >
              <UsersIcon className="w-6 mr-2" />
              PARTICIPANTS
            </div>
            <div className="pb-4 px-4">
              <div className="relative rounded-md shadow-sm">
                <div
                  className={classNames(
                    "absolute inset-y-0 left-0 pl-3",
                    "flex items-center pointer-events-none"
                  )}
                >
                  <SearchIcon className="text-gray-500 w-5" />
                </div>

                <input
                  type="text"
                  value={filterTerm}
                  onChange={({ currentTarget }) => {
                    setFilterTerm(currentTarget.value);
                  }}
                  placeholder="search for participant"
                  className={classNames(
                    "focus:ring-primary-500",
                    "focus:border-primary-500 block w-full pl-10 pr-12",
                    "border-gray-300 rounded-md"
                  )}
                />
              </div>
            </div>
            <div className="px-4 overflow-hidden flex h-full">
              <TableCard<Patient>
                selectedRowId={selectedParticipantId}
                onRowClick={onRowClick}
                headers={headers}
                data={patients}
                getRowId={getRowId}
                page={page}
                onPageChange={setPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                totalRows={totalCount}
                showHeader={false}
                footer={
                  <Footer
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                    totalCount={totalCount}
                  />
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1  w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </Page>
  );
};
