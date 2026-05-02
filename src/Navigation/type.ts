export type AuthStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  SplashScreen: undefined;
  ForgotPassword: undefined;
  OtpAuth: undefined;
  Profile: undefined;
  UserProfile: undefined;
  ProfileSetup: undefined;
  RequiredDocuments: undefined;
  ResetPassword: undefined;
  OtpVerification: {
    email: string;
  };
  CreateNewPassword: {
    email: string;
    otp: string;
  };
  UserMainTabs: undefined;
  UserNearByTrucks: undefined;
  UserMappingView: undefined;
  UserSetDropOff: undefined;
  UserSearchLocation: undefined;
  UserScheduleShifting: undefined;
  UserSelectTruck: undefined;
  UserOrderDetails: undefined;
  UserFindingDrivers: undefined;
  UserEditProfile: undefined;
  DriverMainTabs: undefined;
  UserNotificationSettings: undefined;
  UserPasswordChange: undefined;
  UserPrivacyPolicy: undefined;
  UserHelpSupport: undefined;
  UserActiveJobsDetails: {
    jobId: string;
  };
  UserCompleteJobsDetails: {
    jobId: string;
  };
  LocationPermission: {
    type: any;
  };
  DriverEditProfile: undefined;
  DriverDocuments: undefined;
  DriverEarnings: undefined;
  DriverProfile: undefined;
  DriverJobsDetails: {
    jobId: string;
  };
  DriverJobsComplete: {
    jobId: string;
  };
  JobAssigned: {
    jobId: string;
  };
  HeadingToPickup: {
    jobId: string;
  };
  CurrentJob: {
    jobId: string;
  };
  DriverPayout: undefined;
  VehicleDetails: undefined;
  Notification: undefined;
  PrivacyPolicy: undefined;
  OnBoardingFrist: {
    onBoardData: Array<{
      id: string;
      image: any;
      title: string;
      description: string;
    }>;
    onBoardType: "User" | "Driver";
  };
  RoleSelect: undefined;
  UserLiveTracking: undefined;
};
