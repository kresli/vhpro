interface UserRaw {
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
  dateCreated: string; // Date
  dateUpdated: string; // Date
  diagnosisDate: string; // Date
  disableFreeText: boolean;
  dob: string;
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

export type RawData = {
  ["/api/v1/auth/login"]: {
    accessToken: string;
    refreshToken: string;
    user: UserRaw;
    userId: string;
  };
};
