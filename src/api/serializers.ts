import { Organisation } from "src/types/Organisation";
import { OrganisationRaw } from "src/types/Organisation.raw";
import { User } from "../types";
import { UserRaw } from "../types/User.raw";

export const serializeUser = (userRaw: UserRaw): User => ({
  ...userRaw,
  dateCreated: new Date(userRaw.dateCreated),
  dateUpdated: new Date(userRaw.dateUpdated),
  diagnosisDate: new Date(userRaw.diagnosisDate),
  dob: new Date(userRaw.dob),
});

export const serializeOrganisation = (
  organisationRaw: OrganisationRaw
): Organisation => ({
  ...organisationRaw,
  dateCreated: new Date(organisationRaw.dateCreated),
  dateUpdated: new Date(organisationRaw.dateUpdated),
});
