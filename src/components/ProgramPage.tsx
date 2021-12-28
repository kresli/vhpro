import { FunctionComponent } from "react";
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
  return (
    <Page
      navigation
      title={`${program?.name} program`}
      backAction={{
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name}`,
      }}
      sections={[
        { label: "Patient enrolment", link: `${baseURL}/enrolment` },
        { label: "Reports", link: `${baseURL}/reports` },
        { label: "Questionnaires", link: `${baseURL}/questionnaires` },
        { label: "Team", link: `${baseURL}/team` },
        { label: "Settings", link: `${baseURL}/settings` },
      ]}
    >
      <div className="flex flex-row flex-1 h-full overflow-hidden">
        <div className="flex flex-col w-96 border-r border-slate-400 bg-slate-200">
          <ParticipantsTable
            programId={programId}
            participants={participants}
          />
        </div>
        {children}
      </div>
    </Page>
  );
};
