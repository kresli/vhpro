import classNames from "classnames";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Card, DateRangePicker, ProgramPage } from "src/components";
import { QuestionnaireTag } from "src/components/QuestionnaireTag";
import { useApi } from "src/contexts";
import { Program } from "src/types";

const ReportCard: FunctionComponent<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <div>
      <Card>
        <div
          className={classNames(
            "border-b border-gray-200",
            "text-lg",
            "p-4",
            "sticky"
          )}
        >
          {title}
        </div>
        {children}
      </Card>
    </div>
  );
};

function useProgramLoaded(program: Program | undefined, callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const loaded = useRef(!!program);
  useEffect(() => {
    if (loaded.current) return;
    if (!program) return;
    loaded.current = true;
    callbackRef.current();
  }, [program]);
}

export const ReportsPage = () => {
  const api = useApi();
  const { programId } = useParams<{ programId: string }>();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  const [dateRange, setDateRange] = useState([
    program?.startDate,
    program?.endDate || new Date(),
  ] as [Date | undefined, Date | undefined]);
  useProgramLoaded(program, () =>
    setDateRange([program?.startDate, program?.endDate || new Date()])
  );
  const { data: medications } = useQuery(
    [programId, dateRange[0]?.valueOf(), dateRange[1]?.valueOf()],
    async () => {
      if (!dateRange[0] || !dateRange[1]) return;
      return api.getMedications({
        programId,
        startDate: dateRange[0],
        endDate: dateRange[1],
      });
    }
  );
  console.log(medications);
  return (
    <ProgramPage programId={programId} program={program}>
      <div className="overflow-hidden p-4 flex flex-col">
        <div className="border border-b-gray-300 pb-4">
          <DateRangePicker range={dateRange} onChange={setDateRange} />
        </div>
        <div
          className={classNames(
            "pt-2",
            "grid gap-4 grid-cols-2 auto overflow-y-auto"
          )}
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          }}
        >
          <ReportCard title="General">
            <div className="flex flex-col p-4">
              Start date: {program?.startDate.toLocaleDateString()}
              {program?.availableQuestionnaireTypes.map((tag) => (
                <QuestionnaireTag key={tag} label={tag} />
              ))}
              {program?.consentedPatientsCount} Consented patients
            </div>
          </ReportCard>
          <ReportCard title="Temperature trends">
            <div className="p-4">
              There have been no new temperature logs in the selected time frame
            </div>
          </ReportCard>
          <ReportCard title="Medication adherence"></ReportCard>
          <ReportCard title="Most logged symptoms"></ReportCard>
          <ReportCard title="Symptoms Trends"></ReportCard>
        </div>
      </div>
    </ProgramPage>
  );
};
