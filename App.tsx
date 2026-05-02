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

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }} initialRouteName='SplashScreen' >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelect} />
      <Stack.Screen name="OnBoardingFrist" component={OnBoardingFrist} />
      <Stack.Screen name="SignIn" options={{ animation: "slide_from_left" }} component={SignIn} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="SignUp" component={SignUp} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="OtpAuth" component={OtpAuth} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="OtpVerification" component={OtpVerification} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="CreateNewPassword" component={CreateNewPassword} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="LocationPermission" component={LocationPermission} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserMainTabs" component={UserMainTabs} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserEditProfile" component={UserEditProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserNotificationSettings" component={UserNotificationSettings} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserPasswordChange" component={UserPasswordChange} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserProfile" component={UserProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserPrivacyPolicy" component={UserPrivacyPolicy} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserHelpSupport" component={UserHelpSupport} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserActiveJobsDetails" component={UserActiveJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserCompleteJobsDetails" component={UserCompleteJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserRateDriver" component={UserRateDriver} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserNearByTrucks" component={UserNearByTrucks} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserMappingView" component={UserMappingView} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSetDropOff" component={UserSetDropOff} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSearchLocation" component={UserSearchLocation} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserScheduleShifting" component={UserScheduleShifting} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSelectTruck" component={UserSelectTruck} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserOrderDetails" component={UserOrderDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserFindingDrivers" component={UserFindingDrivers} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserLiveTracking" component={UserLiveTracking} />

      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverMainTabs" component={DriverMainTabs} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="RequiredDocuments" component={RequiredDocuments} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverEditProfile" component={DriverEditProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="VehicleDetails" component={VehicleDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverDocuments" component={DriverDocuments} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverEarnings" component={DriverEarnings} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverPayout" component={DriverPayout} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverJobsDetails" component={DriverJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverJobsComplete" component={DriverJobsComplete} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="JobAssigned" component={JobAssigned} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="HeadingToPickup" component={HeadingToPickup} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="CurrentJob" component={CurrentJob} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverProfile" component={DriverProfile} />

    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }}>
      <Stack.Screen name="RoleSelect" component={RoleSelect} />
      <Stack.Screen name="OnBoardingFrist" component={OnBoardingFrist} />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  const { user } = useAuth();
  const initialRoute = user?.role === 'DRIVER' ? 'DriverMainTabs' : 'UserMainTabs';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, statusBarStyle: "dark" }} initialRouteName={initialRoute as any}>
      {/* User Screens */}
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserMainTabs" component={UserMainTabs} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserEditProfile" component={UserEditProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserNotificationSettings" component={UserNotificationSettings} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserPasswordChange" component={UserPasswordChange} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserProfile" component={UserProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserPrivacyPolicy" component={UserPrivacyPolicy} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserHelpSupport" component={UserHelpSupport} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserActiveJobsDetails" component={UserActiveJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserCompleteJobsDetails" component={UserCompleteJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserRateDriver" component={UserRateDriver} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserNearByTrucks" component={UserNearByTrucks} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserMappingView" component={UserMappingView} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSetDropOff" component={UserSetDropOff} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSearchLocation" component={UserSearchLocation} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserScheduleShifting" component={UserScheduleShifting} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserSelectTruck" component={UserSelectTruck} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserOrderDetails" component={UserOrderDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserFindingDrivers" component={UserFindingDrivers} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="UserLiveTracking" component={UserLiveTracking} />

      {/* Driver Screens */}
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverMainTabs" component={DriverMainTabs} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverEditProfile" component={DriverEditProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="VehicleDetails" component={VehicleDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverDocuments" component={DriverDocuments} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverEarnings" component={DriverEarnings} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverPayout" component={DriverPayout} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverJobsDetails" component={DriverJobsDetails} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverJobsComplete" component={DriverJobsComplete} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="JobAssigned" component={JobAssigned} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="HeadingToPickup" component={HeadingToPickup} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="CurrentJob" component={CurrentJob} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="DriverProfile" component={DriverProfile} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="LocationPermission" component={LocationPermission} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen options={{ animation: "slide_from_right" }} name="RequiredDocuments" component={RequiredDocuments} />
    </Stack.Navigator>
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

  console.log('Active Stack:', activeStack);
  console.log('User:', user);
  console.log('First Launch:', isFirstLaunch);
  console.log('Onboarding Completed:', hasCompletedOnboarding);

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
