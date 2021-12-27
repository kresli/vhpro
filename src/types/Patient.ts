export interface Patient {
  cancerTypes: {
    cancerStage: null | string;
    cancerType: null | string;
    diagnosisDate: null | string;
  }[];
  clinicalSite: string;
  consentGiven: boolean;
  consentStatus: string;
  dateConsentGiven: Date;
  dateConsentRevoked: Date;
  dateCreated: Date;
  dateUpdated: Date;
  dob: null | Date;
  email: string;
  firstName: string;
  friendlyState: string;
  gender: null | string;
  id: string;
  inviteAccepted: boolean;
  lastName: string;
  nhsNumber: null | string;
  questionnairesEarliestDate: Date;
  questionnairesLatestDate: Date;
  reportsEarliestDate: Date;
  reportsLatestDate: Date;
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
