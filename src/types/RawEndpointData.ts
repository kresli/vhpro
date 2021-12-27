import { OrganisationRaw } from "./Organisation.raw";
import { ProgramRaw } from "./Program.raw";
import { UserRaw } from "./User.raw";

export type RawEndpointData = {
  ["/auth/login"]: {
    accessToken: string;
    refreshToken: string;
    user: UserRaw;
    userId: string;
  };
  ["/current"]: UserRaw;
  ["/admin/organisations"]: OrganisationRaw[];
  ["/admin/organisations/:organisationId"]: OrganisationRaw;
  ["/admin/projects"]: ProgramRaw[];
  ["/admin/projects/:projectId"]: ProgramRaw;
  ["/auth/refresh"]: {
    accessToken: string;
    userId: string;
  };
};
