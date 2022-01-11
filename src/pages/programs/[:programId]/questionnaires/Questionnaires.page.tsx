import { useParams } from "react-router-dom";
import { ProgramPage } from "src/components";
import { useGetProgram } from "src/hooks";

export const QuestionnairesPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const { program } = useGetProgram({ programId });
  return (
    <ProgramPage programId={programId} program={program}>
      questionnaires
    </ProgramPage>
  );
};
