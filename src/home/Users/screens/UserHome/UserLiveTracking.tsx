// UserLiveTracking.tsx - With Socket.IO integration
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Image,
  Linking,
  PanResponder,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../../../constants'
import { AuthStackParamList } from '../../../../Navigation/type'
import { DriverLocationData, socketService } from '../../services/socket.service'

interface Driver {
  id: string
  name: string
  rating: number
  vehicle: string
  plate: string
  phone?: string
  image?: any
  eta: number
}

const UserLiveTracking = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const route = useRoute<any>()
  const mapRef = useRef<MapView>(null)
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current

  const {
    pickup,
    dropoff,
    routeData,
    bookingId,
    driver: initialDriver
  } = route.params || {}

  const [driver, setDriver] = useState<Driver>(initialDriver)
  const [eta, setEta] = useState(driver?.eta || 15)
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [rideStatus, setRideStatus] = useState<string>('driver_assigned')
  const [isCalling, setIsCalling] = useState(false)

  // Set offset for smooth dragging
  useEffect(() => {
    pan.setOffset({ x: 0, y: 0 })
  }, [])

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!bookingId) return

    // Listen for driver location updates
    socketService.onDriverLocationUpdate((data: DriverLocationData) => {
      if (data.bookingId === bookingId) {
        setDriverLocation({
          latitude: data.latitude,
          longitude: data.longitude
        })

        // Update ETA based on new location (you can calculate this)
        // For now, we'll decrement ETA periodically
      }
    })

    // Listen for ride status updates
    socketService.onRideStatusUpdate((data) => {
      if (data.bookingId === bookingId) {
        setRideStatus(data.status)

        // Handle different statuses
        switch (data.status) {
          case 'driver_arrived':
            Alert.alert('Driver Arrived', 'Your driver has arrived at the pickup location!')
            break
          case 'ride_started':
            Alert.alert('Ride Started', 'Your ride has started. Heading to destination.')
            break
          case 'ride_completed':
            Alert.alert('Ride Completed', 'You have reached your destination. Thank you for riding with us!')
            setTimeout(() => (navigation as any).navigate('UserRateDriver', { bookingId }), 2000)
            break
          case 'cancelled':
            Alert.alert('Ride Cancelled', data.message || 'Your ride has been cancelled')
            navigation.goBack()
            break
        }
      }
    })

    // Simulate ETA updates
    const etaInterval = setInterval(() => {
      if (rideStatus === 'driver_assigned' && eta > 0) {
        setEta(prev => Math.max(0, prev - 1))
      }
    }, 60000) // Update every minute

    return () => {
      clearInterval(etaInterval)
    }
  }, [bookingId, eta, rideStatus])

  // Fit map to show route and driver
  useEffect(() => {
    if (mapRef.current && pickup && dropoff) {
      const coordinates = [pickup, dropoff]
      if (driverLocation) {
        coordinates.push(driverLocation)
      }
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 50, bottom: 300, left: 50 },
        animated: true
      })
    }
  }, [driverLocation])

  const handleCallDriver = () => {
    if (driver?.phone) {
      setIsCalling(true)
      Linking.openURL(`tel:${driver.phone}`)
        .catch(err => console.error('Error calling:', err))
        .finally(() => setIsCalling(false))
    } else {
      Alert.alert('No Phone Number', 'Driver phone number is not available')
    }
  }

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride? A cancellation fee may apply.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await socketService.cancelRideSearch(bookingId)
            navigation.goBack()
          }
        }
      ]
    )
  }

  const mapInitialRegion = {
    latitude: pickup?.latitude || 48.8566,
    longitude: pickup?.longitude || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const routeCoordinates = routeData?.points || [
    { latitude: pickup?.latitude || 48.8566, longitude: pickup?.longitude || 2.3522 },
    { latitude: dropoff?.latitude || 48.8550, longitude: dropoff?.longitude || 2.3510 }
  ]

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, { dy }) => Math.abs(dy) > 10,
      onPanResponderGrant: () => {
        pan.flattenOffset()
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, { dy, vy }) => {
        if (dy > 100 || vy > 0.5) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 500 },
            useNativeDriver: false,
            speed: 16,
          }).start(() => navigation.goBack())
        } else if (dy < -50 || vy < -0.5) {
          Animated.spring(pan, {
            toValue: { x: 0, y: -100 },
            useNativeDriver: false,
          }).start()
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start()
      },
    })
  ).current

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (rideStatus === 'ride_completed') return 100
    if (rideStatus === 'ride_started') return 66
    if (rideStatus === 'driver_arrived') return 50
    if (rideStatus === 'driver_assigned') return 33
    return 0
  }

  const getStatusText = () => {
    switch (rideStatus) {
      case 'driver_assigned': return 'DRIVER ASSIGNED'
      case 'driver_arrived': return 'DRIVER ARRIVED'
      case 'ride_started': return 'RIDE IN PROGRESS'
      case 'ride_completed': return 'RIDE COMPLETED'
      default: return 'ON THE WAY'
    }
  }

  const getStatusColor = () => {
    switch (rideStatus) {
      case 'ride_completed': return '#10B981'
      case 'ride_started': return '#F59E0B'
      default: return '#4CAF50'
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Map */}
      <View className='flex-1 bg-gray-100'>
        <MapView
          ref={mapRef}
          initialRegion={mapInitialRegion}
          className='h-full w-full'
          style={{ flex: 1 }}
        >
          {/* Pickup Marker */}
          {pickup && (
            <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }} title='Pickup'>
              <View className='h-12 w-12 rounded-full bg-green-500 items-center justify-center shadow-lg border-4 border-white'>
                <MaterialCommunityIcons name='map-marker' size={24} color='white' />
              </View>
            </Marker>
          )}

          {/* Destination Marker */}
          {dropoff && (
            <Marker coordinate={{ latitude: dropoff.latitude, longitude: dropoff.longitude }} title='Destination'>
              <View className='h-8 w-8 rounded-full bg-red-500 items-center justify-center border-2 border-white'>
                <MaterialCommunityIcons name='flag-checkered' size={14} color='white' />
              </View>
            </Marker>
          )}

          {/* Route Line */}
          <Polyline
            coordinates={routeCoordinates}
            strokeColor='#FFA500'
            strokeWidth={50}
            lineDashPattern={[20, 20]}
          />

          {/* Driver Marker */}
          <Marker coordinate={driverLocation || { latitude: pickup?.latitude || 48.8566, longitude: pickup?.longitude || 2.3522 }}>
            <View className='h-10 w-10 rounded-full bg-orange-400 items-center justify-center border-2 border-white'>
              <MaterialCommunityIcons name='truck' size={18} color='white' />
            </View>
          </Marker>
        </MapView>

        {/* Header */}
        <View className='absolute top-0 left-0 right-0 flex-row items-center justify-between px-5 pt-4'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name='chevron-left' size={28} color='#000' />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-800'>Live Tracking</Text>
          <TouchableOpacity onPress={handleCancelRide}>
            <MaterialCommunityIcons name='close' size={28} color='#EF4444' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fixed Bottom Modal */}
      <Animated.View
        style={[
          { minHeight: '35%' },
          { transform: [{ translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg'
      >
        {/* Drag Handle */}
        <View className='items-center py-3'>
          <View className='h-1 w-12 rounded-full bg-gray-300' />
        </View>

        {/* Content */}
        <View className='px-5 pb-6'>
          {/* Status and ETA Row */}
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center gap-2'>
              <View className={`h-3 w-3 rounded-full bg-${getStatusColor() === '#4CAF50' ? 'green' : getStatusColor() === '#F59E0B' ? 'yellow' : 'green'}-500`} />
              <Text className={`text-sm font-bold text-${getStatusColor() === '#4CAF50' ? 'green' : getStatusColor() === '#F59E0B' ? 'yellow' : 'green'}-600`}>
                {getStatusText()}
              </Text>
            </View>
            {eta > 0 && rideStatus !== 'ride_completed' && (
              <Text className='text-xl font-bold text-orange-500'>
                ETA {eta} min
              </Text>
            )}
          </View>

          {/* Main Message */}
          <Text className='text-xl font-bold text-gray-800 mb-6'>
            {rideStatus === 'driver_assigned' && 'Driver is on the way to your pickup location'}
            {rideStatus === 'driver_arrived' && 'Driver has arrived at your location'}
            {rideStatus === 'ride_started' && 'On your way to destination'}
            {rideStatus === 'ride_completed' && 'You have reached your destination'}
          </Text>

          {/* Progress Bar */}
          <View className='mb-6'>
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-xs font-semibold text-gray-600'>Driver</Text>
              <Text className='text-xs font-semibold text-gray-600'>Pickup</Text>
              <Text className='text-xs font-semibold text-gray-600'>Dropoff</Text>
            </View>
            <View className='h-2 bg-gray-200 rounded-full overflow-hidden flex-row'>
              <View
                className={`h-full bg-gradient-to-r from-green-500 to-orange-500`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </View>
          </View>

          {/* Driver Card */}
          <View className='flex-row items-center gap-4 rounded-2xl bg-gray-50 p-4'>
            {/* Driver Photo */}
            <Image
              source={driver?.image || Images.MyProfile}
              className='h-16 w-16 rounded-full'
            />

            {/* Driver Info */}
            <View className='flex-1'>
              <View className='flex-row items-center gap-1 mb-1'>
                <Text className='text-base font-bold text-gray-800'>
                  {driver?.name || 'Driver'}
                </Text>
                <MaterialCommunityIcons name='star' size={14} color='#FFD700' />
                <Text className='text-xs font-semibold text-gray-700'>
                  {driver?.rating || 4.9}
                </Text>
              </View>
              <Text className='text-xs text-gray-600 mb-1'>
                {driver?.vehicle || 'Vehicle'}
              </Text>
              <Text className='text-xs font-semibold text-gray-800'>
                {driver?.plate || 'Plate Number'}
              </Text>
            </View>

            {/* Call Button */}
            <TouchableOpacity
              onPress={handleCallDriver}
              disabled={isCalling}
              className='h-10 w-10 rounded-full bg-green-500 items-center justify-center'
            >
              <MaterialCommunityIcons name='phone' size={18} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default UserLiveTracking