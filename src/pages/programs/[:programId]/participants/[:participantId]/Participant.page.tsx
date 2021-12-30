import { CalendarIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ProgramPage, Table } from "src/components";
import { useApi } from "src/contexts";

const data = Array.from({ length: 999 }).map((_, i) => ({
  id: i,
  label: `${i} row`,
}));

const VerticalCalendar = () => {
  return (
    <div className="flex overflow-hidden flex-col h-full">
      <Table
        data={data}
        getRowId={({ id }) => `${id}`}
        headers={[{ label: "", RowCell: ({ label }) => <div>{label}</div> }]}
        showHeader={false}
        onPageRequest={(next) => console.log("next")}
      />
      {/* <div className="overflow-scroll flex flex-1 h-full">
        <div className="w-full">
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              className={classNames(
                "border border-gray-600 rounded-md",
                "justify-center flex flex-1 items-center",
                "h-12 m-2"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

const HorizontalCalendar = () => {
  return <div>cal</div>;
};

const DateRangePicker = () => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <CalendarIcon className="w-5 text-gray-400" />
        </div>
        <input
          name="start"
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg block w-full pl-10 p-2.5"
          placeholder="Select date start"
        />
      </div>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5 text-gray-400" />
          </div>
        </div>
        <input
          name="end"
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-r-lg block w-full pl-10 p-2.5"
          placeholder="Select date end"
        />
      </div>
    </div>
  );
};

export const ParticipantPage = () => {
  const api = useApi();
  const { programId, participantId } =
    useParams<{ programId: string; participantId: string }>();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participant } = useQuery(
    [programId, participantId],
    async () => (await api.getPatient({ participantId, programId })).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  return (
    <ProgramPage
      programId={programId}
      participants={participants || []}
      program={program}
      selectedParticipantId={participantId}
    >
      <div className="flex flex-col outline-hidden overflow-hidden w-ful h-full">
        <div className="flex shrink-0">
          <div className="text-4xl flex flex-1 border-b border-gray-600">
            {participant?.firstName} {participant?.lastName}
          </div>
        </div>
        <div className="flex flex-row w-full overflow-hidden h-full">
          <div className="flex w-60 flex-col border-r border-gray-600 h-full overflow-hidden">
            <VerticalCalendar />
          </div>
          <div className="flex flex-1">content</div>
        </div>
      </div>
    </ProgramPage>
  );
};
