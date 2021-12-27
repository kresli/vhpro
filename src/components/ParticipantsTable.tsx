import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useApi } from "src/contexts";
import { Patient } from "src/types";
import { Table } from ".";

export const ParticipantsTable = ({
  participants,
  programId,
  selectedParticipantId,
}: {
  participants: Patient[];
  programId: string;
  selectedParticipantId?: string;
}) => {
  // const api = useApi();
  // const { data: patients } = useQuery(
  //   [programId, "patients"],
  //   async () => (await api.getPatients({ programId })).data
  // );
  // if (!patients) return <div>loading</div>;
  return (
    <div className="w-96 border-r h-full">
      <Table
        selectedRowId={selectedParticipantId}
        headers={[
          {
            label: "Patient Name",
            RowCell: ({ firstName, lastName, id }) => (
              <Link to={`/programs/${programId}/participants/${id}`}>
                {firstName} {lastName}
              </Link>
            ),
          },
        ]}
        data={participants}
        getRowId={({ id }) => id}
      />
    </div>
  );
};
