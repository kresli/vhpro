import { useHistory } from "react-router-dom";
import { Patient } from "src/types";
import { Table } from ".";

const STATUSES: Record<string, string> = {
  CONSENT_GIVEN: "Consented",
  AWAITING_CONSENT: "Invite sent",
};

export const ParticipantsTable = ({
  participants,
  programId,
  selectedParticipantId,
}: {
  participants: Patient[];
  programId: string;
  selectedParticipantId?: string;
}) => {
  const history = useHistory();
  return (
    <Table
      selectedRowId={selectedParticipantId}
      onRowClick={({ id }) =>
        history.push(`/programs/${programId}/participants/${id}`)
      }
      headers={[
        {
          label: "Patient Name",
          RowCell: ({ firstName, lastName }) => (
            <div>
              {firstName} {lastName}
            </div>
          ),
        },
        {
          label: "Status",
          RowCell: ({ consentStatus }) => <div>{STATUSES[consentStatus]}</div>,
        },
      ]}
      data={participants}
      getRowId={({ id }) => id}
      rowAction={(row) => <div>retract</div>}
    />
  );
};
