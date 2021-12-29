import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ProgramPage } from "src/components";
import { useApi } from "src/contexts";

export const ReportsPage = () => {
  const api = useApi();
  const { programId } = useParams<{ programId: string }>();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  return (
    <ProgramPage
      programId={programId}
      program={program}
      participants={participants || []}
    >
      reports
    </ProgramPage>
  );
};
