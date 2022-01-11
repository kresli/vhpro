import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  programId: string;
}

export function useGetProgram({ programId }: Props) {
  const api = useApi();
  const { data, ...restQuery } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  return {
    ...restQuery,
    program: data,
  };
}
