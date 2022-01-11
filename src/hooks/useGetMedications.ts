import { useQuery } from "react-query";
import { useApi } from "src/contexts";

interface Props {
  programId: string;
  rangeStartDate?: Date;
  rangeEndDate?: Date;
}

export function useGetMedications({
  programId,
  rangeEndDate,
  rangeStartDate,
}: Props) {
  const api = useApi();
  const { data } = useQuery(
    [
      programId,
      "medications",
      rangeStartDate?.valueOf(),
      rangeEndDate?.valueOf(),
    ],
    async () => {
      if (!rangeStartDate || !rangeEndDate) return;
      return api.getMedications({
        programId,
        startDate: rangeStartDate,
        endDate: rangeEndDate,
      });
    }
  );
  return { medications: data };
}
