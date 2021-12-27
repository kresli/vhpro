import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page, ParticipantsTable, Tabs } from "src/components";
import { useApi } from "src/contexts";

export const ParticipantPage = () => {
  const api = useApi();
  const { programId, participantId } =
    useParams<{ programId: string; participantId: string }>();
  const { data: participant, isLoading: isLoadingParticipant } = useQuery(
    [programId, participantId],
    async () => (await api.getPatient({ participantId, programId })).data
  );
  const { data: program, isLoading: isLoadingProgram } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  const isLoading = isLoadingParticipant || isLoadingProgram;
  console.log(program);
  return (
    <Page
      navigation
      loadingContent={isLoading}
      title={`${program?.name} program`}
      backAction={{
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name}`,
      }}
      sections={[
        { label: "Participants" },
        { label: "Reports" },
        { label: "Questionnaires" },
        { label: "Team" },
        { label: "Settings" },
      ]}
    >
      <div className="flex flex-row w-full flex-1">
        <ParticipantsTable
          selectedParticipantId={participantId}
          programId={programId}
          participants={participants || []}
        />
        participant
      </div>
    </Page>
  );
};
