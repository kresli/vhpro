import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { FunctionComponent, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Page, Table } from "src/components";
import { Patient, Program } from "src/types";
import { TableHeader } from "./Table";

interface Props {
  programId: string;
  program?: Program;
  participants: Patient[];
  selectedParticipantId?: string;
}

export const ProgramPage: FunctionComponent<Props> = ({
  programId,
  program,
  children,
  participants,
  selectedParticipantId,
}) => {
  const baseURL = `/programs/${programId}`;
  const history = useHistory();
  const sections = useMemo(
    () => [
      { label: "Patient enrolment", link: `${baseURL}/enrolment` },
      { label: "Reports", link: `${baseURL}/reports` },
      { label: "Questionnaires", link: `${baseURL}/questionnaires` },
      { label: "Team", link: `${baseURL}/team` },
      { label: "Settings", link: `${baseURL}/settings` },
    ],
    [baseURL]
  );
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
        RowCell: ({ firstName, lastName, severeSymptomsCount, id }) => (
          <div className="relative group px-6 py-4 whitespace-nowrap flex-1 flex">
            {selectedParticipantId === id && (
              <div className="absolute h-full w-1 bg-primary-500 left-0 top-0" />
            )}
            <div>
              {firstName} {lastName}
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
    [selectedParticipantId]
  );
  return (
    <Page
      navigation
      title={`${program?.name} program`}
      sections={sections}
      backAction={{
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name} organisation`,
      }}
    >
      <div className="flex flex-row flex-1 h-full overflow-hidden">
        <div className="flex flex-col w-96 border-r border-slate-300 bg-slate-200 shrink-0">
          <div className="flex flex-col overflow-hidden">
            <div className="h-16 justify-center items-center flex text-gray-400">
              Program participants
            </div>
            <div className="pb-4 px-4 border-b border-black/10">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-500 w-5" />
                </div>

                <input
                  type="text"
                  value=""
                  onChange={({ currentTarget }) => {}}
                  placeholder="search for participant"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12  border-gray-300 rounded-md"
                />
              </div>
            </div>
            <Table
              selectedRowId={selectedParticipantId}
              onRowClick={onRowClick}
              showHeader={false}
              headers={headers}
              data={participants}
              getRowId={({ id }) => id}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1  w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </Page>
  );
};
