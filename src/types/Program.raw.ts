import { OrganisationRaw } from "./Organisation.raw";

export interface ProgramRaw {
  availableQuestionnaireTypes: string[];
  consentMessage: string;
  consentedPatientsCount: number;
  dateCreated: string; // Date
  dateUpdated: string; // Date
  description: null | null;
  disableFreeText: false;
  endDate: string | null; // Date
  identifier: string;
  imageThumbnailUrl: string | null;
  imageUrl: string | null;
  name: string;
  organisation: OrganisationRaw;
  projectId: string;
  projectPeriod: null;
  startDate: string; // Date
  usersCount: number;
}
