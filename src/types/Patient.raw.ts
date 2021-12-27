export interface PatientRaw {
  cancerTypes: {
    cancerStage: null | string;
    cancerType: null | string;
    diagnosisDate: null | string;
  }[];
  clinicalSite: string;
  consentGiven: boolean;
  consentStatus: string;
  dateConsentGiven: string; // Date;
  dateConsentRevoked: string; // Date;
  dateCreated: string; // Date;
  dateUpdated: string; // Date;
  dob: null | string; // Date
  email: string;
  firstName: string;
  friendlyState: string;
  gender: null | string;
  id: string;
  inviteAccepted: boolean;
  lastName: string;
  nhsNumber: null | string;
  questionnairesEarliestDate: string; // Date
  questionnairesLatestDate: string; // Date
  reportsEarliestDate: string; // Date
  reportsLatestDate: string; // Date
  severeSymptomsCount: number;
  signupActiveTreatments: [];
  signupCancerStage: null;
  signupCancerTypes: string[];
  state: string;
  status: string;
  stepsAppleHealthEnabled: boolean;
  stepsFitbitEnabled: boolean;
  stepsGoogleFitEnabled: boolean;
  userEmail: string;
}
