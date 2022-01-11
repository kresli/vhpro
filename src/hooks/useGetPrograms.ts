import { useQuery } from "react-query";
import { useApi } from "src/contexts";
interface Props {
  organisationId: string;
}
export function useGetPrograms({ organisationId }: Props) {
  const api = useApi();
  const { data } = useQuery(["programs", organisationId], () =>
    api.getPrograms({ organisationId })
  );
  return {
    programs: data?.programs || [],
    totalCount: data?.totalCount || 0,
  };
}
