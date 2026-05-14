import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useState } from 'react'
import {
  AppState,
  AppStateStatus,
  RefreshControl,
  ScrollView,
  StatusBar,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '../../../../Auth/UserContext'
import { AuthStackParamList } from '../../../../Navigation/type'
import { useJobs } from '../../../../Utils/hooks/useJobs'
import { useLocation } from '../../../../Utils/hooks/useLocation'
import { useNearbyTrucks } from '../../../../Utils/hooks/useNearbyTrucks'
import { AllVendorsContent } from '../../Components/HomeScreen/AllVendorsContent'
import { HeroBanner } from '../../Components/HomeScreen/HeroBanner'
import { LocationHeader } from '../../Components/HomeScreen/LocationHeader'
import { LocationModal } from '../../Components/HomeScreen/LocationModal'

const Home = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const { fetchUserProfile } = useUser()
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    currentLocation,
    isLoadingLocation,
    locationCoords,
    fetchCurrentLocation
  } = useLocation()

  const {
    activeJobs,
    recentJobs,
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs
  } = useJobs()

  const {
    trucks: nearByTrucks,
    isLoading: trucksLoading,
    refresh: refreshTrucks,
    fetchNearbyTrucks,
  } = useNearbyTrucks()

  // Memoize active job to prevent unnecessary re-renders
  const activeJob = useMemo(() => {
    if (activeJobs && activeJobs.length > 0) {
      const firstJob = activeJobs[0]
      return {
        id: firstJob.id,
        name: firstJob.name,
        date: firstJob.date || new Date().toISOString(),
        status: 'active' as const,
        statusText: firstJob.statusText || 'On the way',
        pickupAddress: firstJob.pickupAddress || 'Pickup address not available',
        dropoffAddress: firstJob.dropoffAddress || 'Dropoff address not available'
      }
    }
    return null
  }, [activeJobs])

  // Load user profile on focus so avatar is available
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile()
    }, [])
  )

  // Fetch nearby trucks when location is available
  useFocusEffect(
    useCallback(() => {
      if (locationCoords) {
        fetchNearbyTrucks(locationCoords, true)
      }
    }, [locationCoords, fetchNearbyTrucks])
  )

  // Handle app state changes (when app comes back to foreground)
  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          // Refresh data when app comes to foreground
          if (locationCoords) {
            fetchNearbyTrucks(locationCoords, false)
          }
          refetchJobs()
        }
      })

      return () => {
        subscription.remove()
      }
    }, [locationCoords, fetchNearbyTrucks, refetchJobs])
  )

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      // Refresh location first
      await fetchCurrentLocation()

      // Then refresh data with new location if available
      if (locationCoords) {
        await Promise.all([
          refreshTrucks(locationCoords),
          refetchJobs()
        ])
      } else {
        await refetchJobs()
      }
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [locationCoords, fetchCurrentLocation, refreshTrucks, refetchJobs])

  const handleLocationPress = useCallback(() => {
    setShowLocationModal(true)
  }, [])

  const handleLocationModalClose = useCallback(() => {
    setShowLocationModal(false)
  }, [])

  const handleLocationRefresh = useCallback(async () => {
    await fetchCurrentLocation()
    if (locationCoords) {
      await fetchNearbyTrucks(locationCoords, true)
    }
  }, [fetchCurrentLocation, locationCoords, fetchNearbyTrucks])

  const handleBookPress = useCallback((truckId: string) => {
    (navigation as any).navigate("UserMappingView", { truckId })
  }, [navigation])

  const handleTrackPress = useCallback(() => {
    if (activeJob?.id) {
      navigation.navigate("UserActiveJobsDetails", { jobId: activeJob.id })
    }
  }, [navigation, activeJob])

  const handleViewPress = useCallback((jobId: string) => {
    navigation.navigate("UserCompleteJobsDetails", { jobId })
  }, [navigation])

  const handleRebookPress = useCallback((jobId: string) => {
    (navigation as any).navigate("UserMappingView", { rebookJobId: jobId })
  }, [navigation])

  const isLoading = jobsLoading || trucksLoading

  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <LocationModal
        visible={showLocationModal}
        currentLocation={currentLocation}
        locationCoords={locationCoords}
        onClose={handleLocationModalClose}
        onRefresh={handleLocationRefresh}
      />

      <StatusBar barStyle="light-content" />

      <View className='flex-1'>
        <LocationHeader
          currentLocation={currentLocation}
          isLoadingLocation={isLoadingLocation}
          onLocationPress={handleLocationPress}
          onProfilePress={() => navigation.navigate("UserProfile")}
        />

        <ScrollView
          className='bg-gray-50 flex-1 rounded-t-3xl px-5 pt-6'
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || isLoading}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        >
          <HeroBanner onBookPress={() => navigation.navigate("UserMappingView")} />

          <AllVendorsContent
            nearByTrucks={nearByTrucks}
            activeJobs={activeJobs}
            recentJobs={recentJobs}
            activeJob={activeJob}
            isLoading={isLoading}
            onSeeAllNearby={() => navigation.navigate("UserNearByTrucks")}
            onBookPress={handleBookPress}
            onTrackPress={handleTrackPress}
            onViewPress={handleViewPress}
            onRebookPress={handleRebookPress}
            onSeeAllRecent={()=>("")}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home