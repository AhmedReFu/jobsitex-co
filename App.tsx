import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';
import "./global.css";
import CreateNewPassword from './src/Auth/CreateNewPassword';
import ForgotPassword from './src/Auth/ForgotPassword';
import OtpAuth from './src/Auth/OtpAuth';
import OtpVerification from './src/Auth/OtpVerification';
import SignIn from './src/Auth/SignIn';
import SignUp from './src/Auth/SignUp';
import ProfileSetup from './src/home/Drivers/ProfileSetup/ProfileSetup';
import RequiredDocuments from './src/home/Drivers/ProfileSetup/RequiredDocuments';
import CurrentJob from './src/home/Drivers/screens/DriverJobs/CurrentJob';
import DriverJobsComplete from './src/home/Drivers/screens/DriverJobs/DriverJobsComplete';
import DriverJobsDetails from './src/home/Drivers/screens/DriverJobs/DriverJobsDetails';
import HeadingToPickup from './src/home/Drivers/screens/DriverJobs/HeadingToPickup';
import JobAssigned from './src/home/Drivers/screens/DriverJobs/JobAssigned';
import DriverDocuments from './src/home/Drivers/screens/DriverProfile/DriverDocuments';
import DriverEarnings from './src/home/Drivers/screens/DriverProfile/DriverEarnings';
import DriverEditProfile from './src/home/Drivers/screens/DriverProfile/DriverEditProfile';
import DriverPayout from './src/home/Drivers/screens/DriverProfile/DriverPayout';
import VehicleDetails from './src/home/Drivers/screens/DriverProfile/VehicleDetails';
import DriverProfile from './src/home/Drivers/TabNavigation/DriverProfile';
import DriverMainTabs from './src/home/Drivers/TabNavigation/TabNavigation';
import UserFindingDrivers from './src/home/Users/screens/UserHome/UserFindingDrivers';
import UserMappingView from './src/home/Users/screens/UserHome/UserMappingView';
import UserNearByTrucks from './src/home/Users/screens/UserHome/UserNearByTrucks';
import UserOrderDetails from './src/home/Users/screens/UserHome/UserOrderDetails';
import UserScheduleShifting from './src/home/Users/screens/UserHome/UserScheduleShifting';
import UserSearchLocation from './src/home/Users/screens/UserHome/UserSearchLocation';
import UserSelectTruck from './src/home/Users/screens/UserHome/UserSelectTruck';
import UserSetDropOff from './src/home/Users/screens/UserHome/UserSetDropOff';
import UserActiveJobsDetails from './src/home/Users/screens/UserJobs/UserActiveJobsDetails';
import UserCompleteJobsDetails from './src/home/Users/screens/UserJobs/UserCompleteJobsDetails';
import UserRateDriver from './src/home/Users/screens/UserJobs/UserRateDriver';
import UserEditProfile from './src/home/Users/screens/UserProfile/UserEditProfile';
import UserHelpSupport from './src/home/Users/screens/UserProfile/UserHelpSupport';
import UserNotificationSettings from './src/home/Users/screens/UserProfile/UserNotificationSettings';
import UserPasswordChange from './src/home/Users/screens/UserProfile/UserPasswordChange';
import UserPrivacyPolicy from './src/home/Users/screens/UserProfile/UserPrivacyPolicy';
import UserMainTabs from './src/home/Users/TabNavigation/TabNavigation';
import UserProfile from './src/home/Users/TabNavigation/UserProfile';
import { AuthStackParamList } from './src/Navigation/type';
import OnBoardingFrist from './src/Onboarding/OnBoardingFrist';
import RoleSelect from './src/Onboarding/RoleSelect';
import SplashScreen from './src/Onboarding/SplashScreen';
import LocationPermission from './src/Settings/LocationPermission';
import { AuthProvider, useAuth } from './src/Auth/AuthContext';
import { UserProvider } from './src/Auth/UserContext';
import { BookingProvider } from './src/Auth/BookingContext';
import { ActivityIndicator, View } from 'react-native';
import UserLiveTracking from './src/home/Users/screens/UserHome/UserLiveTracking';

const AuthNav = createNativeStackNavigator<AuthStackParamList>();
const MainNav = createNativeStackNavigator<AuthStackParamList>();
const OnboardingNav = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  const { isFirstLaunch } = useAuth();
  const initialRoute = isFirstLaunch ? 'SplashScreen' : 'SignIn';
  return (
    <AuthNav.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }} initialRouteName={initialRoute}>
      <AuthNav.Screen name="SplashScreen" component={SplashScreen} />
      <AuthNav.Screen name="RoleSelect" component={RoleSelect} />
      <AuthNav.Screen name="OnBoardingFrist" component={OnBoardingFrist} />
      <AuthNav.Screen name="SignIn" options={{ animation: "slide_from_left" }} component={SignIn} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="SignUp" component={SignUp} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="OtpAuth" component={OtpAuth} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="ForgotPassword" component={ForgotPassword} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="OtpVerification" component={OtpVerification} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="CreateNewPassword" component={CreateNewPassword} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="LocationPermission" component={LocationPermission} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserMainTabs" component={UserMainTabs} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserEditProfile" component={UserEditProfile} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserNotificationSettings" component={UserNotificationSettings} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserPasswordChange" component={UserPasswordChange} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserProfile" component={UserProfile} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserPrivacyPolicy" component={UserPrivacyPolicy} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserHelpSupport" component={UserHelpSupport} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserActiveJobsDetails" component={UserActiveJobsDetails} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserCompleteJobsDetails" component={UserCompleteJobsDetails} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserRateDriver" component={UserRateDriver} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserNearByTrucks" component={UserNearByTrucks} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserMappingView" component={UserMappingView} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserSetDropOff" component={UserSetDropOff} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserSearchLocation" component={UserSearchLocation} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserScheduleShifting" component={UserScheduleShifting} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserSelectTruck" component={UserSelectTruck} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserOrderDetails" component={UserOrderDetails} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserFindingDrivers" component={UserFindingDrivers} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="UserLiveTracking" component={UserLiveTracking} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverMainTabs" component={DriverMainTabs} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="ProfileSetup" component={ProfileSetup} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="RequiredDocuments" component={RequiredDocuments} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverEditProfile" component={DriverEditProfile} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="VehicleDetails" component={VehicleDetails} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverDocuments" component={DriverDocuments} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverEarnings" component={DriverEarnings} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverPayout" component={DriverPayout} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverJobsDetails" component={DriverJobsDetails} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverJobsComplete" component={DriverJobsComplete} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="JobAssigned" component={JobAssigned} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="HeadingToPickup" component={HeadingToPickup} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="CurrentJob" component={CurrentJob} />
      <AuthNav.Screen options={{ animation: "slide_from_right" }} name="DriverProfile" component={DriverProfile} />
    </AuthNav.Navigator>
  );
}

function OnboardingStack() {
  return (
    <OnboardingNav.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }}>
      <OnboardingNav.Screen name="RoleSelect" component={RoleSelect} />
      <OnboardingNav.Screen name="OnBoardingFrist" component={OnBoardingFrist} />
    </OnboardingNav.Navigator>
  );
}

function MainAppStack() {
  const { user } = useAuth();
  const initialRoute = user?.role === 'DRIVER' ? 'DriverMainTabs' : 'UserMainTabs';
  return (
    <MainNav.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }} initialRouteName={initialRoute as any}>
      {/* User Screens */}
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserMainTabs" component={UserMainTabs} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserEditProfile" component={UserEditProfile} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserNotificationSettings" component={UserNotificationSettings} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserPasswordChange" component={UserPasswordChange} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserProfile" component={UserProfile} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserPrivacyPolicy" component={UserPrivacyPolicy} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserHelpSupport" component={UserHelpSupport} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserActiveJobsDetails" component={UserActiveJobsDetails} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserCompleteJobsDetails" component={UserCompleteJobsDetails} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserRateDriver" component={UserRateDriver} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserNearByTrucks" component={UserNearByTrucks} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserMappingView" component={UserMappingView} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserSetDropOff" component={UserSetDropOff} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserSearchLocation" component={UserSearchLocation} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserScheduleShifting" component={UserScheduleShifting} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserSelectTruck" component={UserSelectTruck} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserOrderDetails" component={UserOrderDetails} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserFindingDrivers" component={UserFindingDrivers} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="UserLiveTracking" component={UserLiveTracking} />

      {/* Driver Screens */}
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverMainTabs" component={DriverMainTabs} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverEditProfile" component={DriverEditProfile} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="VehicleDetails" component={VehicleDetails} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverDocuments" component={DriverDocuments} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverEarnings" component={DriverEarnings} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverPayout" component={DriverPayout} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverJobsDetails" component={DriverJobsDetails} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverJobsComplete" component={DriverJobsComplete} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="JobAssigned" component={JobAssigned} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="HeadingToPickup" component={HeadingToPickup} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="CurrentJob" component={CurrentJob} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="DriverProfile" component={DriverProfile} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="LocationPermission" component={LocationPermission} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="ProfileSetup" component={ProfileSetup} />
      <MainNav.Screen options={{ animation: "slide_from_right" }} name="RequiredDocuments" component={RequiredDocuments} />
    </MainNav.Navigator>
  );
}

function AppNavigation() {
  const { user, isLoading, isFirstLaunch, hasCompletedOnboarding } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Determine which stack to show
  const getActiveStack = () => {
    // User is logged in
    if (user) {
      // Check if this is a new user who hasn't completed onboarding
      if (isFirstLaunch && !hasCompletedOnboarding) {
        return 'onboarding';
      }
      // Existing user - go to main app
      return 'mainApp';
    }

    // User is not logged in
    return 'auth';
  };

  const activeStack = getActiveStack();

  if (activeStack === 'mainApp') {
    return <MainAppStack />;
  } else if (activeStack === 'onboarding') {
    return <OnboardingStack />;
  } else {
    return <AuthStack />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
          <NavigationContainer>
            <StatusBar style='dark' />
            <AppNavigation />
          </NavigationContainer>
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}
