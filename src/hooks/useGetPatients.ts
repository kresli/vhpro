import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  page: number;
  perPage: number;
  term?: string;
  programId: string;
}
interface Options {
  keepPreviousData: boolean;
}
export function useGetPatients(
  { programId, page, perPage, term }: Props,
  { keepPreviousData }: Options
) {
  const api = useApi();
  const { data, ...restQuery } = useQuery(
    [programId, "patients", page, perPage, term],
    () =>
      api.getPatients({
        programId,
        perPage,
        page,
        term,
      }),
    { keepPreviousData }
  );
  return {
    ...restQuery,
    patients: data?.patients || [],
    totalCount: data?.totalCount || 0,
  };
}
