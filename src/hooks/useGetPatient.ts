import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  programId: string;
  patientId: string;
}

export function useGetPatient({ programId, patientId }: Props) {
  const api = useApi();
  const { data } = useQuery(
    [programId, patientId],
    async () =>
      (await api.getPatient({ participantId: patientId, programId })).data
  );
  return { patient: data };
}
