import { FunctionComponent } from "react";
import { Page } from "src/components";
import { Program } from "src/types";

interface Props {
  programId: string;
  program?: Program;
}

export const ProgramPage: FunctionComponent<Props> = ({
  programId,
  program,
  children,
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
        { label: "Participants", link: `${baseURL}/participants` },
        { label: "Reports", link: `${baseURL}/reports` },
        { label: "Questionnaires", link: `${baseURL}/questionnaires` },
        { label: "Team", link: `${baseURL}/team` },
        { label: "Settings", link: `${baseURL}/settings` },
      ]}
    >
      {children}
    </Page>
  );
};
