import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ParticipantsTable } from "src/components";
import { Page } from "src/components/Page";
import { useApi } from "src/contexts";

export const ProgramPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const { data: program } = useQuery(
    ["program", programId],
    async () => (await api.getProgram(programId)).data
  );
  const { data: participants } = useQuery(
    [programId, "patients"],
    async () => (await api.getPatients({ programId })).data
  );
  return (
    <Page
      navigation
      title={`${program?.name} program`}
      loadingContent={!program}
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
      <div className="flex flex-row flex-1">
        <ParticipantsTable
          programId={programId}
          participants={participants || []}
        />
      </div>
    </Page>
  );
};
