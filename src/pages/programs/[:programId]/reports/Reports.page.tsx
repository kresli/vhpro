import classNames from "classnames";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, DateRangePicker, ProgramPage, Table } from "src/components";
import { QuestionnaireTag } from "src/components/QuestionnaireTag";
import { useGetMedications, useGetProgram } from "src/hooks";
import { useGetSymptoms } from "src/hooks/useGetSymptoms";
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
  const { programId } = useParams<{ programId: string }>();
  const { program } = useGetProgram({ programId });
  const [dateRange, setDateRange] = useState([
    program?.startDate,
    program?.endDate || new Date(),
  ] as [Date | undefined, Date | undefined]);
  useProgramLoaded(program, () =>
    setDateRange([program?.startDate, program?.endDate || new Date()])
  );
  const { medications } = useGetMedications({
    programId,
    rangeStartDate: dateRange[0],
    rangeEndDate: dateRange[1],
  });
  const { symptoms } = useGetSymptoms({
    programId,
    rangeEndDate: dateRange[0],
    rangeStartDate: dateRange[1],
  });
  return (
    <ProgramPage programId={programId} program={program}>
      <div className="overflow-hidden p-4 flex flex-col">
        <div className="border-b border-gray-300 pb-4">
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
          <ReportCard title="Medication adherence">
            <Table
              data={medications || []}
              headers={[
                {
                  label: "Name",
                  RowCell: ({ medicationName }) => (
                    <div className="p-4">{medicationName}</div>
                  ),
                },
                {
                  label: "Adherence",
                  RowCell: ({ adherence }) => (
                    <div className="p-4">{adherence}%</div>
                  ),
                },
                {
                  label: "Skipped doses",
                  RowCell: ({ eventsSkipped }) => (
                    <div className="p-4">{eventsSkipped} doses skipped</div>
                  ),
                },
              ]}
              getRowId={({ medicationName }) => medicationName}
            />
            <div className="text-sm p-4 text-gray-400">
              * adherence to all scheduled medications by all patients
            </div>
          </ReportCard>
          <ReportCard title="Most logged symptoms">
            <Table
              data={symptoms}
              headers={[
                {
                  label: "symptom",
                  RowCell: ({ logType }) => (
                    <div className="p-4">{logType.name}</div>
                  ),
                },
                {
                  label: "Logs",
                  RowCell: ({ count }) => <div>{count}</div>,
                },
                {
                  label: "Grade 0",
                  RowCell: ({ grades }) => <div>{grades["0"].count}</div>,
                },
                {
                  label: "Grade 1",
                  RowCell: ({ grades }) => <div>{grades["1"].count}</div>,
                },
                {
                  label: "Grade 2",
                  RowCell: ({ grades }) => <div>{grades["2"].count}</div>,
                },
                {
                  label: "Grade 3",
                  RowCell: ({ grades }) => <div>{grades["3"]?.count}</div>,
                },
                {
                  label: "Grade 4",
                  RowCell: ({ grades }) => <div>{grades["4"]?.count}</div>,
                },
              ]}
              getRowId={(d) => {
                console.log(d);
                return d.logType.identifier;
              }}
            />
          </ReportCard>
          <ReportCard title="Symptoms Trends"></ReportCard>
        </div>
      </div>
    </ProgramPage>
  );
};
