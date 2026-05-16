import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../Navigation/type';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'USER' | 'DRIVER';
  isVerified: boolean;
  profile?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirstLaunch: boolean;
  signIn: (userData: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  token: string | null;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);

  // Check if first launch
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (firstLaunch === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('isFirstLaunch', 'false');
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  // Load user data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('vToken');
      const storedUser = await AsyncStorage.getItem('vUser');
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setHasCompletedOnboardingState(onboardingCompleted === 'true');
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: User, authToken: string) => {
    try {
      await AsyncStorage.setItem('vToken', authToken);
      await AsyncStorage.setItem('vUser', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['vToken', 'vRefreshToken', 'vUser', 'vDriver', '@user_data', '@user_profile_image']);
    } catch (error) {
      console.error('Error clearing storage on sign out:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('vUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const setHasCompletedOnboarding = async (value: boolean) => {
    await AsyncStorage.setItem('onboardingCompleted', value.toString());
    setHasCompletedOnboardingState(value);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirstLaunch: isFirstLaunch ?? true,
        signIn,
        signOut,
        updateUser,
        token,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};