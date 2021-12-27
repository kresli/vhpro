import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ParticipantsTable, ProgramPage } from "src/components";
import { useApi } from "src/contexts";

export const ParticipantsPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  return (
    <ProgramPage programId={programId} program={program}>
      <div className="flex flex-row flex-1">
        <ParticipantsTable
          programId={programId}
          participants={participants || []}
        />
      </div>
    </ProgramPage>
  );
};
