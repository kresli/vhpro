import classNames from "classnames";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Card, ProgramPage } from "src/components";
import { QuestionnaireTag } from "src/components/QuestionnaireTag";
import { useApi } from "src/contexts";

const ReportCard: FunctionComponent<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <div>
      <Card>
        <div
          className={classNames("border-b border-gray-200", "text-lg", "p-4")}
        >
          {title}
        </div>
        {children}
      </Card>
    </div>
  );
};

export const ReportsPage = () => {
  const api = useApi();
  const { programId } = useParams<{ programId: string }>();
  const { data: program } = useQuery(
    [programId],
    async () => (await api.getProgram(programId)).data
  );
  return (
    <ProgramPage programId={programId} program={program}>
      <div
        className="p-4 grid gap-4 grid-cols-2 auto"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
        }}
      >
        <ReportCard title="General">
          <div className="flex flex-col p-4">
            Start date: {program?.startDate.toLocaleDateString()}
            {program?.availableQuestionnaireTypes.map((tag) => (
              <QuestionnaireTag label={tag} />
            ))}
            {program?.consentedPatientsCount} Consented patients
          </div>
        </ReportCard>
        <ReportCard title="Temperature trends"></ReportCard>
        <ReportCard title="Medication adherence"></ReportCard>
        <ReportCard title="Most logged symptoms"></ReportCard>
        <ReportCard title="Symptoms Trends"></ReportCard>
      </div>
    </ProgramPage>
  );
};
