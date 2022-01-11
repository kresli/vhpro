import { useQuery } from "react-query";
import { useApi } from "src/contexts";

export function useGetOrganisations({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) {
  const api = useApi();
  const { data, ...restQuery } = useQuery([page, perPage], () =>
    api.getOrganisations({ page, perPage })
  );
  return {
    ...restQuery,
    organisations: data?.organisations || [],
    totalCount: data?.totalCount || 0,
  };
}
