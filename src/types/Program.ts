import { Organisation } from ".";

export interface Program {
  availableQuestionnaireTypes: string[];
  consentMessage: string;
  consentedPatientsCount: number;
  dateCreated: Date;
  dateUpdated: Date;
  description: null | null;
  disableFreeText: false;
  endDate: Date | null; // Date
  identifier: string;
  imageThumbnailUrl: string | null;
  imageUrl: string | null;
  name: string;
  organisation: Organisation;
  projectId: string;
  projectPeriod: null;
  startDate: Date;
  usersCount: number;
}
