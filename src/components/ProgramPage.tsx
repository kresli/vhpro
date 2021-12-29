import { FunctionComponent, useMemo } from "react";
import { Page, ParticipantsTable } from "src/components";
import { Patient, Program } from "src/types";

interface Props {
  programId: string;
  program?: Program;
  participants: Patient[];
}

export const ProgramPage: FunctionComponent<Props> = ({
  programId,
  program,
  children,
  participants,
}) => {
  const baseURL = `/programs/${programId}`;
  const sections = useMemo(
    () => [
      { label: "Patient enrolment", link: `${baseURL}/enrolment` },
      { label: "Reports", link: `${baseURL}/reports` },
      { label: "Questionnaires", link: `${baseURL}/questionnaires` },
      { label: "Team", link: `${baseURL}/team` },
      { label: "Settings", link: `${baseURL}/settings` },
    ],
    [baseURL]
  );
  return (
    <Page
      navigation
      title={`${program?.name} program`}
      sections={sections}
      backAction={{
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name}`,
      }}
    >
      <div className="flex flex-row flex-1 h-full overflow-hidden">
        <div className="flex flex-col w-96 border-r border-slate-300 bg-slate-200 shrink-0">
          <ParticipantsTable
            programId={programId}
            participants={participants}
          />
        </div>
        <div className="flex flex-col flex-1  w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </Page>
  );
};
