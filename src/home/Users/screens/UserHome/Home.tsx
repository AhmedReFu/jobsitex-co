import { IPA_BASE } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Alert,
  AppState,
  AppStateStatus,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
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
  const [isRebooking, setIsRebooking] = useState(false)

  const {
    currentLocation,
    isLoadingLocation,
    locationCoords,
    fetchCurrentLocation,
  } = useLocation()

  const {
    activeJobs,
    recentJobs,
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useJobs()

  const {
    trucks: nearByTrucks,
    isLoading: trucksLoading,
    refresh: refreshTrucks,
    fetchNearbyTrucks,
  } = useNearbyTrucks()

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
        dropoffAddress: firstJob.dropoffAddress || 'Dropoff address not available',
      }
    }
    return null
  }, [activeJobs])

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile()
    }, []),
  )

  useFocusEffect(
    useCallback(() => {
      if (locationCoords) {
        fetchNearbyTrucks(locationCoords, true)
      }
    }, [locationCoords, fetchNearbyTrucks]),
  )

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          if (locationCoords) fetchNearbyTrucks(locationCoords, false)
          refetchJobs()
        }
      })
      return () => subscription.remove()
    }, [locationCoords, fetchNearbyTrucks, refetchJobs]),
  )

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchCurrentLocation()
      if (locationCoords) {
        await Promise.all([refreshTrucks(locationCoords), refetchJobs()])
      } else {
        await refetchJobs()
      }
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [locationCoords, fetchCurrentLocation, refreshTrucks, refetchJobs])

  const handleRebookPress = useCallback(
    async (jobId: string) => {
      if (isRebooking) return
      try {
        setIsRebooking(true)
        const token = await AsyncStorage.getItem('vToken')

        const jobRes = await axios.get(`${IPA_BASE}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        })
        const job = jobRes.data?.data

        if (!job?.driver?.user?.id || !job?.truckType?.id) {
          navigation.navigate('UserMappingView')
          return
        }

        navigation.navigate('UserDirectBooking', {
          driverUserId: job.driver.user.id,
          truckTypeId: job.truckType.id,
          truckName: job.truckType.name,
          driverName: job.driver.user.fullName,
          driverAvatar: job.driver.user.avatar,
        })
      } catch {
        navigation.navigate('UserMappingView')
      } finally {
        setIsRebooking(false)
      }
    },
    [isRebooking, navigation],
  )

  const isLoading = jobsLoading || trucksLoading

  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <LocationModal
        visible={showLocationModal}
        currentLocation={currentLocation}
        locationCoords={locationCoords}
        onClose={() => setShowLocationModal(false)}
        onRefresh={async () => {
          await fetchCurrentLocation()
          if (locationCoords) await fetchNearbyTrucks(locationCoords, true)
        }}
      />

      <StatusBar barStyle='light-content' />

      <View className='flex-1'>
        <LocationHeader
          currentLocation={currentLocation}
          isLoadingLocation={isLoadingLocation}
          onLocationPress={() => setShowLocationModal(true)}
          onProfilePress={() => navigation.navigate('UserProfile')}
        />

        <ScrollView
          className='bg-gray-50 flex-1 rounded-t-3xl px-5 pt-6'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || isLoading}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
              tintColor='#4CAF50'
            />
          }
        >
          <HeroBanner onBookPress={() => navigation.navigate('UserMappingView')} />

          <AllVendorsContent
            nearByTrucks={nearByTrucks}
            activeJobs={activeJobs}
            recentJobs={recentJobs}
            activeJob={activeJob}
            isLoading={isLoading}
            isRebooking={isRebooking}
            onSeeAllNearby={() => navigation.navigate('UserNearByTrucks')}
            onBookPress={(truckId) => (navigation as any).navigate('UserMappingView', { truckId })}
            onTrackPress={() => {
              if (activeJob?.id) navigation.navigate('UserLiveTracking', { jobId: activeJob.id })
            }}
            onViewPress={(jobId) => navigation.navigate('UserCompleteJobsDetails', { jobId })}
            onRebookPress={handleRebookPress}
            onSeeAllRecent={() => {}}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home
