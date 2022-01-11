import { useParams } from "react-router-dom";
import { ProgramPage, Table } from "src/components";
import { useGetPatient, useGetProgram } from "src/hooks";

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
      />
    </div>
  );
};

export const ParticipantPage = () => {
  const { programId, participantId } =
    useParams<{ programId: string; participantId: string }>();
  const { program } = useGetProgram({ programId });
  const { patient } = useGetPatient({ programId, patientId: participantId });

  return (
    <ProgramPage
      programId={programId}
      program={program}
      selectedParticipantId={participantId}
    >
      <div className="flex flex-col outline-hidden overflow-hidden w-ful h-full">
        <div className="flex shrink-0">
          <div className="text-4xl flex flex-1 border-b border-gray-600">
            {patient?.firstName} {patient?.lastName}
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
