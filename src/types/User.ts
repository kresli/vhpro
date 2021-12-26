export interface User {
  activityDataEnabled: boolean;
  availableCourses: Record<
    string,
    {
      content: string;
      name: string;
      number_of_steps: number;
    }
  >;
  cancerTypes: {
    cancerStage: null;
    cancerType: string;
    diagnosisDate: null;
  }[];
  dateCreated: Date;
  dateUpdated: Date;
  diagnosisDate: Date;
  disableFreeText: boolean;
  dob: Date;
  email: string;
  emailVerified: boolean;
  ethnicity: string;
  eula: boolean;
  firstName: string;
  flags: [];
  gender: string;
  id: string;
  keyTerms: boolean;
  language: string;
  lastName: string;
  marketingConsent: boolean;
  nhsNumber: null | string;
  permissions: string[];
  privacyPolicy: boolean;
  projects: [];
  pushNotificationsEnabled: boolean;
  signupActiveTreatments: string[];
  signupCancerStage: string;
  signupCancerType: string;
  signupCancerTypes: string[];
  stepsAppleHealthEnabled: boolean;
  stepsFitbitEnabled: boolean;
  stepsGoogleFitEnabled: boolean;
  temperatureUnit: string;
  timezone: string;
  userRole: string;
  weeklyEmailConsent: boolean;
  weightUnit: string;
}
