import { OrganisationRaw } from "./Organisation.raw";
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
  ["/auth/refresh"]: {
    accessToken: string;
    userId: string;
  };
};
