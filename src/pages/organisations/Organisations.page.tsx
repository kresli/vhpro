import { useEffect } from "react";
import { Page } from "src/components";
import { useApi } from "src/contexts";

const Table = () => {};

export const OrganisationsPage = () => {
  const api = useApi();
  useEffect(() => {
    const run = async () => {
      const d = await api.getOrganisations({});
      console.log(d);
    };
    run();
  }, [api]);
  return <Page navigation>organisations page</Page>;
};
