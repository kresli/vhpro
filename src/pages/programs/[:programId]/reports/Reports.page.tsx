import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page, ProgramPage } from "src/components";
import { useApi } from "src/contexts";

export const ReportsPage = () => {
  const api = useApi();
  const { programId } = useParams<{ programId: string }>();
  const { data: program, isLoading } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );

  return (
    <ProgramPage programId={programId} program={program}>
      reports
    </ProgramPage>
  );
};
