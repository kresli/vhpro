import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ProgramPage } from "src/components";
import { useApi } from "src/contexts";

export const ParticipantPage = () => {
  const api = useApi();
  const { programId, participantId } =
    useParams<{ programId: string; participantId: string }>();
  const { data: program, isLoading: isLoadingProgram } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participant, isLoading: isLoadingParticipant } = useQuery(
    [programId, participantId],
    async () => (await api.getPatient({ participantId, programId })).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  const isLoading = isLoadingParticipant || isLoadingProgram;
  const baseURL = `/programs/${programId}`;
  return (
    <ProgramPage
      programId={programId}
      participants={participants || []}
      program={program}
      // sections={[
      //   { label: "Participants", link: `${baseURL}/participants` },
      //   { label: "Reports", link: `${baseURL}/reports` },
      //   { label: "Questionnaires", link: `${baseURL}/questionnaires` },
      //   { label: "Team", link: `${baseURL}/team` },
      //   { label: "Settings", link: `${baseURL}/settings` },
      // ]}
    >
      <div className="flex justify-center flex-1">
        <div className="text-4xl p-4 ">
          {participant?.firstName} {participant?.lastName}
        </div>
      </div>
    </ProgramPage>
  );
};
