// UserMappingView.tsx - Fixed version
import React, { useState, useEffect, useCallback } from 'react'
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { AuthStackParamList } from '../../../../Navigation/type'
import { useLocation } from '../../../../Utils/hooks/useLocation'
import { useRouteDirection } from '../../../../Utils/hooks/useRouteDirection'
import { LocationData } from '../../Components/SearchLocation/type'
import { RouteMap } from '../../Components/SearchLocation/RouteMap'
import { useRecentLocations } from '../../../../Utils/hooks/useRecentLocations'
import { useBooking } from '../../../../Auth/BookingContext'


const UserMappingView = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const route = useRoute<any>()
  const { locationCoords, currentLocation, fetchCurrentLocation } = useLocation()
  const { getRoute, clearRoute } = useRouteDirection()
  const { saveLocation } = useRecentLocations()
  const {
    pickupLocation,
    dropoffLocation,
    routeData,
    setPickupLocation,
    setDropoffLocation,
    setRouteData,
    clearLocationData
  } = useBooking()

  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [isGettingRoute, setIsGettingRoute] = useState(false)

  // Initialize pickup location from current location
  useEffect(() => {
    if (locationCoords && !pickupLocation) {
      setPickupLocation({
        id: 'current',
        title: 'Current Location',
        address: currentLocation || 'Current Location',
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude
      })
    }
  }, [locationCoords, currentLocation])

  // Handle dropoff from navigation params (coming from search)
  useEffect(() => {
    if (route.params?.dropoffLocation) {
      setDropoffLocation(route.params.dropoffLocation)
      // Clear previous route data when new dropoff is set
      setRouteData(null)
    }
  }, [route.params?.dropoffLocation])

  // Get route when both locations are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupLocation && dropoffLocation && !routeData && !isGettingRoute) {
        setIsGettingRoute(true)
        setIsRouteLoading(true)
        try {
          const result = await getRoute(pickupLocation, dropoffLocation)
          if (result) {
            setRouteData(result)
          }
        } catch (error) {
          console.error('Error getting route:', error)
          Alert.alert('Error', 'Failed to calculate route. Please try again.')
        } finally {
          setIsGettingRoute(false)
          setIsRouteLoading(false)
        }
      }
    }
    fetchRoute()
  }, [pickupLocation, dropoffLocation, routeData, getRoute])

  const handlePickupChange = useCallback((location: LocationData) => {
    setPickupLocation(location)
    setRouteData(null)
  }, [setPickupLocation, setRouteData])

  const handleDropoffChange = useCallback((location: LocationData) => {
    setDropoffLocation(location)
    setRouteData(null)
  }, [setDropoffLocation, setRouteData])

  // UserMappingView.tsx - Update the handleDropoffPress and handlePickupPress
  const handlePickupPress = () => {
    navigation.navigate('UserSearchLocation', { type: 'pickup' } as any)
  }

  const handleDropoffPress = () => {
    navigation.navigate('UserSetDropOff')
  }

  const handleNextPress = () => {
    if (!pickupLocation) {
      Alert.alert('Missing Info', 'Please select a pickup location')
      return
    }
    if (!dropoffLocation) {
      Alert.alert('Missing Info', 'Please select a drop-off location')
      return
    }
    if (!routeData) {
      Alert.alert('Please wait', 'Route is still calculating...')
      return
    }

    navigation.navigate('UserScheduleShifting')
  }

  const handleCenterOnCurrentLocation = async () => {
    await fetchCurrentLocation()
    if (locationCoords) {
      setPickupLocation({
        id: 'current',
        title: 'Current Location',
        address: currentLocation || 'Current Location',
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude
      })
      setRouteData(null)
    }
  }

  const handleClearDropoff = () => {
    setDropoffLocation(null)
    setRouteData(null)
  }

  return (
    <SafeAreaView className='flex-1 bg-transparent'>
      <StatusBar barStyle='dark-content' />

      <View className='flex-1'>
        {/* Map */}
        <RouteMap
          pickup={pickupLocation}
          dropoff={dropoffLocation}
          routeData={routeData}
          onPickupChange={handlePickupChange}
          onDropoffChange={handleDropoffChange}
          isLoading={isRouteLoading}
        />

        {/* Header */}
        <View className='absolute top-0 left-0 right-0 flex-row items-center justify-between bg-white px-5 py-4 border-b border-gray-200'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name='chevron-left' size={28} color='#000' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-800'>Select Location</Text>
          <TouchableOpacity onPress={handleCenterOnCurrentLocation}>
            <MaterialCommunityIcons name='crosshairs-gps' size={24} color='#4CAF50' />
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='absolute bottom-0 left-0 right-0'
        >
          <View className='bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-lg'>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* PICKUP LOCATION */}
              <View className='mb-4'>
                <Text className='mb-2 text-sm font-semibold text-gray-700'>
                  PICKUP LOCATION
                </Text>
                <TouchableOpacity
                  onPress={handlePickupPress}
                  className='flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3'
                >
                  <View className='h-8 w-8 rounded-full bg-green-500 items-center justify-center'>
                    <MaterialCommunityIcons name='circle' size={12} color='white' />
                  </View>
                  <View className='ml-3 flex-1'>
                    <Text className='text-base font-semibold text-gray-800' numberOfLines={1}>
                      {pickupLocation?.title || 'Select pickup location'}
                    </Text>
                    <Text className='text-xs text-gray-500' numberOfLines={1}>
                      {pickupLocation?.address || 'Tap to select'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name='chevron-right' size={20} color='#999' />
                </TouchableOpacity>
              </View>

              {/* DROP-OFF LOCATION */}
              <View className='mb-4'>
                <Text className='mb-2 text-sm font-semibold text-gray-700'>
                  DROP-OFF LOCATION
                </Text>
                <TouchableOpacity
                  onPress={handleDropoffPress}
                  className='flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3'
                >
                  <View className='h-8 w-8 rounded-full bg-red-500 items-center justify-center'>
                    <MaterialCommunityIcons name='flag' size={12} color='white' />
                  </View>
                  <View className='ml-3 flex-1'>
                    <Text className='text-base font-semibold text-gray-800' numberOfLines={1}>
                      {dropoffLocation?.title || 'Select drop-off location'}
                    </Text>
                    <Text className='text-xs text-gray-500' numberOfLines={1}>
                      {dropoffLocation?.address || 'Tap to select'}
                    </Text>
                  </View>
                  {dropoffLocation ? (
                    <TouchableOpacity onPress={handleClearDropoff} className='mr-2'>
                      <MaterialCommunityIcons name='close-circle' size={20} color='#999' />
                    </TouchableOpacity>
                  ) : (
                    <MaterialCommunityIcons name='chevron-right' size={20} color='#999' />
                  )}
                </TouchableOpacity>
              </View>

              {/* Route Info */}
              {isRouteLoading && (
                <View className='mb-4 rounded-2xl bg-gray-50 p-4 items-center'>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text className='text-sm text-gray-600 mt-2'>Calculating route...</Text>
                </View>
              )}

              {routeData && !isRouteLoading && (
                <View className='mb-4 rounded-2xl bg-green-50 p-4'>
                  <View className='flex-row justify-between mb-3'>
                    <View className='flex-row items-center'>
                      <MaterialCommunityIcons name='map-marker-distance' size={20} color='#4CAF50' />
                      <Text className='ml-2 text-gray-600'>Distance</Text>
                    </View>
                    <Text className='text-lg font-bold text-gray-800'>
                      {routeData.distance?.toFixed(1)} km
                    </Text>
                  </View>
                  <View className='flex-row justify-between'>
                    <View className='flex-row items-center'>
                      <MaterialCommunityIcons name='clock-outline' size={20} color='#4CAF50' />
                      <Text className='ml-2 text-gray-600'>Duration</Text>
                    </View>
                    <Text className='text-lg font-bold text-gray-800'>
                      {Math.round(routeData.duration)} min
                    </Text>
                  </View>
                </View>
              )}

              {/* NEXT BUTTON */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleNextPress}
                disabled={!pickupLocation || !dropoffLocation || isRouteLoading}
                className={`mb-4 rounded-2xl py-4 ${pickupLocation && dropoffLocation && !isRouteLoading
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }`}
              >
                <Text className='text-center text-lg font-bold text-white'>
                  {isRouteLoading ? 'CALCULATING...' : 'NEXT'}
                </Text>
              </TouchableOpacity>

              <Text className='text-center text-xs text-gray-400'>
                Drag markers on map to adjust location
              </Text>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default UserMappingView