import { Organisation } from "src/types/Organisation";
import { OrganisationRaw } from "src/types/Organisation.raw";
import { Program, ProgramRaw, User } from "../types";
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

export const serializeProgram = (program: ProgramRaw): Program => ({
  ...program,
  dateCreated: new Date(program.dateCreated),
  dateUpdated: new Date(program.dateUpdated),
  startDate: new Date(program.startDate),
  endDate: program.endDate ? new Date(program.endDate) : null,
  organisation: serializeOrganisation(program.organisation),
});
