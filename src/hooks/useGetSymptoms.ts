import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  programId: string;
  rangeStartDate?: Date;
  rangeEndDate?: Date;
}

export function useGetSymptoms({
  programId,
  rangeEndDate,
  rangeStartDate,
}: Props) {
  const api = useApi();
  const { data } = useQuery(
    [programId, "symptoms", rangeEndDate?.valueOf(), rangeStartDate?.valueOf()],
    async () => {
      if (!rangeEndDate || !rangeStartDate) return;
      return api.getSymptomps({
        programId,
        startDate: rangeEndDate,
        endDate: rangeStartDate,
      });
    }
  );
  return { symptoms: data || [] };
}
