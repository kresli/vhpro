import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { FieldText, ParticipantsTable, ProgramPage } from "src/components";
import { useApi } from "src/contexts";
import { useForm } from "src/hooks";
import { classNames } from "src/utils";

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
  const filter = useForm({
    name: {
      type: "text",
      defaultValue: "",
      placeholder: "search for participant",
    },
  });
  return (
    <ProgramPage programId={programId} program={program}>
      <div className="flex flex-col flex-1">
        <div className="flex p-4 space-x-4">
          <div className="flex flex-1">
            <div className="flex flex-1 max-w-lg">
              <FieldText field={filter.fields.name} />
            </div>
          </div>
          <button
            type="button"
            className={classNames(
              "inline-flex items-center px-4 py-2 border",
              "border-transparent rounded-md shadow-sm text-sm",
              "font-medium text-white bg-primary-600 hover:bg-primary-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "focus:ring-indigo-500"
            )}
          >
            Add new patient
          </button>
        </div>
        <ParticipantsTable
          programId={programId}
          participants={participants || []}
        />
      </div>
    </ProgramPage>
  );
};
