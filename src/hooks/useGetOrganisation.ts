import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  organisationId: string;
}

export function useGetOrganisation({ organisationId }: Props) {
  const api = useApi();
  const { data, ...restQuery } = useQuery(
    ["organisation", organisationId],
    async () => (await api.getOrganisation(organisationId)).data
  );
  return {
    ...restQuery,
    organisation: data || null,
  };
}
