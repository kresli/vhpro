import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page } from "src/components/Page";
import { useApi } from "src/contexts";

export const ProgramPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const api = useApi();
  const { data: program } = useQuery(
    ["program", programId],
    async () => (await api.getProgram(programId)).data
  );
  console.log(program);
  return (
    <Page
      navigation
      title={`${program?.name} program`}
      loadingContent={!program}
      backAction={{
        href: `/organisations/${program?.organisation.organisationId}`,
        label: `${program?.organisation.name}`,
      }}
    ></Page>
  );
};
