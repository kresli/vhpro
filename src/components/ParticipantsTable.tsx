import { SearchIcon } from "@heroicons/react/solid";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="h-16 justify-center items-center flex text-gray-400">
        Program participants
      </div>
      <div className="pb-4 px-4 border-b border-black/10">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-500 w-5" />
          </div>

          <input
            type="text"
            value=""
            onChange={({ currentTarget }) => {}}
            placeholder="search for participant"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12  border-gray-300 rounded-md"
          />
        </div>
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
            RowCell: ({ firstName, lastName, severeSymptomsCount }) => (
              <div className="relative group">
                <div>
                  {firstName} {lastName}
                </div>
                {!!severeSymptomsCount && (
                  <div className="absolute h-full  right-0 top-0 flex">
                    <div className="bg-red-400 flex-inline rounded-full px-4 text-sm flex items-center">
                      <div className="flex whitespace-nowrap space-x-1">
                        <span>{severeSymptomsCount}</span>
                        <span className="hidden group-hover:block">
                          SEVERE SYMPTOMPS
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
