import { useHistory } from "react-router-dom";
import { useForm } from "src/hooks";
import { Patient } from "src/types";
import { FieldText, Table } from ".";

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
  const filter = useForm({
    name: {
      type: "text",
      defaultValue: "",
      placeholder: "search for participant",
    },
  });
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="h-16 justify-center items-center flex text-gray-400">
        Program participants
      </div>
      <div className="pb-4 px-4 border-b border-black/10">
        <FieldText field={filter.fields.name} />
      </div>
      <Table
        selectedRowId={selectedParticipantId}
        onRowClick={({ id }) =>
          history.push(`/programs/${programId}/participants/${id}`)
        }
        showHeader={false}
        headers={[
          {
            label: "Patient Name",
            RowCell: ({ firstName, lastName }) => (
              <div>
                {firstName} {lastName}
              </div>
            ),
          },
        ]}
        data={participants}
        getRowId={({ id }) => id}
      />
    </div>
  );
};
